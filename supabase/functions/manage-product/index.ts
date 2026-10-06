// Edge Function: "CMS" tối giản cho trang /admin/san-pham/ (tháng 10/2026) — site vẫn là site TĨNH
// (GitHub Pages), sản phẩm vẫn lưu dạng file Markdown TRONG CHÍNH REPO GIT như trước (không chuyển
// sang lưu ở Supabase — xem lý do chọn hướng này trong CLAUDE.md, mục "Trang quản lý sản phẩm").
// Function này đọc/ghi trực tiếp các file đó qua GitHub Contents API. Mỗi lần lưu tạo 1 commit thật
// vào nhánh `main`, tự kích hoạt workflow deploy có sẵn — khoảng 1-2 phút sau sản phẩm lên web, đúng
// tốc độ hiện có khi sửa file thủ công.
//
// Dùng khóa GITHUB_TOKEN (Personal Access Token PHẠM VI HẸP — chỉ "Contents: Read and write" của
// ĐÚNG repo này) để gọi GitHub API — khóa bí mật này CHỈ tồn tại ở đây (Edge Function), không lộ ra
// trình duyệt. Cần chủ website tự tạo token và đặt qua `supabase secrets set GITHUB_TOKEN=...` (xem
// CLAUDE.md mục "Trang quản lý sản phẩm" để biết cách tạo).
//
// 3 action: "list" (danh sách sản phẩm), "get" (đọc 1 sản phẩm để sửa), "save" (tạo mới/cập nhật).
// QUAN TRỌNG: KHÔNG nhúng dữ liệu sản phẩm (kể cả bản nháp) vào HTML tĩnh của trang admin — trang đó
// chỉ là vỏ JS rỗng, mọi dữ liệu đọc qua function này, đã xác thực đúng admin mới trả về. Nếu nhúng
// sẵn vào HTML lúc build, sản phẩm nháp (chưa kiểm duyệt) sẽ lộ ra ngoài cho BẤT KỲ AI xem mã nguồn
// trang, kể cả chưa đăng nhập — vi phạm đúng nguyên tắc "draft chỉ thấy lúc npm run dev" của dự án.

import { createClient } from 'npm:@supabase/supabase-js@2';
import yaml from 'npm:js-yaml@4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');

const REPO_OWNER = 'huynam-codegym';
const REPO_NAME = 'duoc-si-thuong';
const BRANCH = 'main';
const PRODUCTS_DIR = 'src/content/products';
const ASSETS_DIR = 'src/assets/products';

const ALLOWED_ORIGINS = new Set(['https://duocsithuong.com', 'http://localhost:4321']);

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://duocsithuong.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

async function githubFetch(path: string, init?: RequestInit) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
}

async function getFile(path: string): Promise<{ sha: string; content: string } | null> {
  const res = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} lỗi (${res.status}): ${await res.text()}`);
  const data = await res.json();
  // GitHub trả content dạng base64 (có ngắt dòng mỗi 60 ký tự) — bỏ ngắt dòng rồi mới decode.
  // BẪY ĐÃ GẶP: atob() một mình chỉ trả về "chuỗi nhị phân" (mỗi ký tự = 1 byte, kiểu Latin-1), KHÔNG
  // tự ghép lại đúng các ký tự tiếng Việt vốn mã hoá UTF-8 nhiều byte (ví dụ "ệ") — ra chữ bị lỗi kiểu
  // "Viá»t Nam" thay vì "Việt Nam". Vì CHỈ đọc/ghi sha ở hầu hết chỗ gọi getFile() (không đụng tới
  // "content"), lỗi này ẩn mình rất lâu — chỉ lộ ra khi parseFrontmatter() đưa "content" bị lỗi này qua
  // yaml.load(), và CHỈ 1 số chuỗi byte lỗi tình cờ tạo ra ký tự điều khiển (non-printable) khiến YAML
  // parse LỖI HẲN (list/get sản phẩm có tiếng Việt báo lỗi "the stream contains non-printable
  // characters") — các trường hợp khác chỉ hiện SAI CHỮ chứ không báo lỗi, càng khó phát hiện qua test
  // nhanh. Phải decodeURIComponent(escape(...)) thêm 1 bước để ghép lại đúng UTF-8 — đúng chiều ngược
  // với toBase64() bên dưới (encodeURIComponent/unescape trước khi btoa()).
  const content = decodeURIComponent(escape(atob(String(data.content).replace(/\n/g, ''))));
  return { sha: data.sha, content };
}

async function putFile(path: string, contentBase64: string, message: string, sha?: string) {
  const res = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: contentBase64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} lỗi (${res.status}): ${await res.text()}`);
  return res.json();
}

function toBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

interface ProductFrontmatter {
  name: string;
  summary: string;
  department: string;
  group: string;
  price?: number;
  originalPrice?: number;
  unit?: string;
  brand?: string;
  origin: string;
  dosageForm?: string;
  ingredients?: string;
  imageAlt: string;
  publicationNo?: string;
  adConfirmationNo?: string;
  draft: boolean;
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data = (yaml.load(match[1]) as Record<string, unknown>) ?? {};
  return { data, body: match[2].replace(/^\n+/, '') };
}

// Thứ tự khoá cố định cho dễ đọc diff trên GitHub, khớp đúng mẫu src/content/products/san-pham-mau.md.
// updatedAt/draft tự ghép tay (không qua yaml.dump) để chắc chắn ra đúng định dạng ngày trần
// "YYYY-MM-DD" như các file viết tay — js-yaml có thể tự quote chuỗi ngày nếu để nó tự xử lý.
function buildMarkdown(fm: ProductFrontmatter, imagePath: string, body: string): string {
  const ordered: Record<string, unknown> = {
    name: fm.name,
    summary: fm.summary,
    department: fm.department,
    group: fm.group,
  };
  if (fm.price !== undefined) ordered.price = fm.price;
  if (fm.originalPrice !== undefined) ordered.originalPrice = fm.originalPrice;
  if (fm.unit) ordered.unit = fm.unit;
  if (fm.brand) ordered.brand = fm.brand;
  ordered.origin = fm.origin;
  if (fm.dosageForm) ordered.dosageForm = fm.dosageForm;
  if (fm.ingredients) ordered.ingredients = fm.ingredients;
  ordered.image = imagePath;
  ordered.imageAlt = fm.imageAlt;
  if (fm.publicationNo) ordered.publicationNo = fm.publicationNo;
  if (fm.adConfirmationNo) ordered.adConfirmationNo = fm.adConfirmationNo;

  const yamlText = yaml.dump(ordered, { lineWidth: -1 });
  const dateStr = new Date().toISOString().slice(0, 10);
  return `---\n${yamlText}updatedAt: ${dateStr}\ndraft: ${fm.draft ? 'true' : 'false'}\n---\n\n${body.trim()}\n`;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: 'Thiếu cấu hình Supabase trên Edge Function.' }, 500, headers);
  }

  // Xác thực ĐÚNG admin — function này có quyền ghi thẳng vào repo nên không thể chỉ tin phía trình
  // duyệt (khác chat/email vốn chỉ đọc/ghi dữ liệu đã có RLS gác), phải tự kiểm tra lại session thật.
  const authHeader = req.headers.get('authorization') ?? '';
  const jwt = authHeader.replace(/^Bearer /i, '');
  if (!jwt) return json({ error: 'Chưa đăng nhập.' }, 401, headers);

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);
  if (userError || !userData.user) return json({ error: 'Phiên đăng nhập không hợp lệ.' }, 401, headers);

  const { data: profile } = await supabaseAdmin.from('profiles').select('is_admin').eq('id', userData.user.id).maybeSingle();
  if (!profile?.is_admin) return json({ error: 'Tài khoản này không có quyền quản trị sản phẩm.' }, 403, headers);

  if (!GITHUB_TOKEN) {
    return json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Supabase — xem CLAUDE.md mục "Trang quản lý sản phẩm".' }, 500, headers);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Dữ liệu không hợp lệ.' }, 400, headers);
  }

  try {
    if (payload.action === 'list') {
      const res = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCTS_DIR}?ref=${BRANCH}`);
      if (!res.ok) throw new Error(`Không đọc được danh sách (${res.status}): ${await res.text()}`);
      const files = (await res.json()) as { name: string; type: string }[];
      const mdFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
      const items = await Promise.all(
        mdFiles.map(async (f) => {
          const slug = f.name.replace(/\.md$/, '');
          const file = await getFile(`${PRODUCTS_DIR}/${f.name}`);
          if (!file) return null;
          const { data } = parseFrontmatter(file.content);
          return {
            slug,
            name: data.name ?? slug,
            department: data.department ?? '',
            group: data.group ?? '',
            draft: data.draft !== false,
          };
        }),
      );
      const list = items.filter((x): x is NonNullable<typeof x> => x !== null).sort((a, b) => String(a.name).localeCompare(String(b.name), 'vi'));
      return json({ ok: true, products: list }, 200, headers);
    }

    if (payload.action === 'get') {
      const slug = String(payload.slug ?? '');
      if (!slug) return json({ error: 'Thiếu slug.' }, 400, headers);
      const file = await getFile(`${PRODUCTS_DIR}/${slug}.md`);
      if (!file) return json({ error: 'Không tìm thấy sản phẩm.' }, 404, headers);
      const { data, body } = parseFrontmatter(file.content);
      // image lưu trong frontmatter dạng "../../assets/products/<slug>/anh.<ext>" — tách lấy tên file
      // để client tự dựng URL xem ảnh hiện tại qua raw.githubusercontent.com (repo công khai, không
      // cần token để xem).
      const imagePath = String(data.image ?? '');
      const imageFilename = imagePath.split('/').pop() ?? '';
      return json({ ok: true, slug, data, body, imageFilename }, 200, headers);
    }

    if (payload.action === 'save') {
      const slug = String(payload.slug ?? '').trim();
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
        return json({ error: 'Đường dẫn (slug) không hợp lệ — chỉ chữ thường, số và dấu gạch ngang.' }, 400, headers);
      }
      const fm = payload.frontmatter as ProductFrontmatter;
      if (!fm?.name || !fm.summary || !fm.department || !fm.group || !fm.origin || !fm.imageAlt) {
        return json({ error: 'Thiếu trường bắt buộc.' }, 400, headers);
      }

      let imageFilename = String(payload.existingImageFilename ?? '');
      const image = payload.image as { base64: string; ext: string } | undefined;
      if (image) {
        imageFilename = `anh.${image.ext}`;
        const imagePath = `${ASSETS_DIR}/${slug}/${imageFilename}`;
        const existing = await getFile(imagePath);
        await putFile(imagePath, image.base64, `${existing ? 'Cập nhật' : 'Thêm'} ảnh sản phẩm: ${fm.name}`, existing?.sha);
      }
      if (!imageFilename) {
        return json({ error: 'Thiếu ảnh sản phẩm.' }, 400, headers);
      }

      const relativeImagePath = `../../assets/products/${slug}/${imageFilename}`;
      const markdown = buildMarkdown(fm, relativeImagePath, String(payload.body ?? ''));
      const mdPath = `${PRODUCTS_DIR}/${slug}.md`;
      const existingMd = await getFile(mdPath);
      await putFile(mdPath, toBase64(markdown), `${existingMd ? 'Cập nhật' : 'Thêm'} sản phẩm: ${fm.name}`, existingMd?.sha);

      return json({ ok: true, slug, actionsUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/actions` }, 200, headers);
    }

    return json({ error: 'action không hợp lệ.' }, 400, headers);
  } catch (err) {
    console.error(err);
    return json({ error: err instanceof Error ? err.message : 'Có lỗi xảy ra.' }, 500, headers);
  }
});
