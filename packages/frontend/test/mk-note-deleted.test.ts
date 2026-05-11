/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { afterEach, assert, describe, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/vue';
import { ref } from 'vue';
import './init';
import { preferState } from './init';
import type * as Misskey from 'misskey-js';
import MkNote from '@/components/MkNote.vue';

vi.mock('@/composables/use-note-capture.js', () => {
	return {
		noteEvents: {
			emit: vi.fn(),
		},
		useNoteCapture: () => ({
			$note: ref({
				reactions: {},
				reactionEmojis: {},
				myReaction: null,
				reactionCount: 0,
				pollChoices: [],
			}),
			subscribe: vi.fn(),
		}),
	};
});

vi.mock('@/plugin.js', () => {
	return {
		getPluginHandlers: () => [],
	};
});

describe('MkNote deleted note rendering', () => {
	afterEach(() => {
		cleanup();
		preferState.instanceTicker = false;
	});

	test('should hide ghost user avatar and ticker for deleted notes', () => {
		preferState.instanceTicker = 'always';

		const deletedNote = {
			id: 'deleted-note',
			createdAt: '2026-01-01T00:00:00.000Z',
			userId: 'ghost-user',
			user: {
				id: 'ghost-user',
				name: 'Ghost User',
				username: 'ghost',
				host: 'ghost.example',
				instance: {
					name: 'Ghost Instance',
				},
				isBot: false,
				badgeRoles: [],
				avatarUrl: 'https://example.com/avatar.png',
				avatarBlurhash: null,
				avatarDecorations: [],
			},
			visibility: 'public',
			localOnly: false,
			text: null,
			cw: null,
			replyId: null,
			reply: null,
			renoteId: null,
			renote: null,
			channel: null,
			isHidden: false,
			deletedAt: '2026-01-01T00:01:00.000Z',
			files: [],
			poll: null,
			emojis: {},
			repliesCount: 0,
			renoteCount: 0,
			reactionAcceptance: 'likeOnly',
		} as Misskey.entities.Note;

		const note = render(MkNote, {
			props: {
				note: deletedNote,
				mock: true,
			},
			global: {
				directives: {
					hotkey: {},
					tooltip: {},
					'user-preview': {},
				},
				stubs: {
					I18n: { template: '<span><slot name="name" /><slot name="word" /></span>' },
					MkA: { template: '<a><slot /></a>' },
					MkAcct: { props: ['user'], template: '<span>@{{ user?.username }}</span>' },
					MkAvatar: { props: ['user'], template: '<div data-testid="avatar">{{ user?.name }}</div>' },
					MkCwButton: true,
					MkInstanceTicker: { props: ['host'], template: '<div data-testid="instance-ticker">{{ host }}</div>' },
					MkLoading: true,
					MkMediaList: true,
					MkNoteSimple: true,
					MkNoteSub: true,
					MkPoll: true,
					MkReactionsViewer: true,
					MkRippleEffect: true,
					MkTime: { template: '<time />' },
					MkUrlPreview: true,
					MkUserName: { props: ['user'], template: '<span>{{ user?.name }}</span>' },
					Mfm: { props: ['text'], template: '<span>{{ text }}</span>' },
				},
			},
		});

		assert.ok(note.getByText('Unknown User'));
		assert.strictEqual(note.queryByTestId('avatar'), null);
		assert.strictEqual(note.queryByTestId('instance-ticker'), null);
		assert.strictEqual(note.queryByText('Ghost User'), null);
	});
});
