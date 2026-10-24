// Bumeter's own wording; the shared strings (quota, context, errors) come from the kit.
import { localize } from '@bumeter/vscode-kit/format';

export const t = localize({
  vi: {
    noLimits: 'Chưa có số 5h/7d: bật theo dõi hạn mức trong app Bumeter, hoặc dùng `bum statusline`.',
    openOverview: 'Mở Overview', refresh: 'Làm mới',
    reads: 'Agent đọc {n} lần trong 7 ngày', readsNoEdit: ', không sửa lần nào', readsEdits: ', sửa {n} lần',
  },
  en: {
    noLimits: 'No 5h/7d numbers yet: turn on quota tracking in the Bumeter app, or use `bum statusline`.',
    openOverview: 'Open Overview', refresh: 'Refresh',
    reads: 'Read {n} times by agents in 7 days', readsNoEdit: ', never edited', readsEdits: ', edited {n} times',
  },
});
