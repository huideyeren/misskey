/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as Misskey from 'misskey-js';

export function shouldCollapsed(note: Misskey.entities.Note, urls: string[]): boolean {
	const collapsed = note.cw == null && (
		(note.text != null && (
			(note.text.includes('$[x2')) ||
			(note.text.includes('$[x3')) ||
			(note.text.includes('$[x4')) ||
			(note.text.includes('$[scale')) ||
			(note.text.split('\n').length > 10) ||
			(note.text.length > 500) ||
			(urls.length > 4)
		)) || (note.files != null && note.files.length > 8)
	);

	return collapsed;
}
