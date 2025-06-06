<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header>
		<MkTab v-model="tab" :class="$style.tab">
			<option value="featured">{{ i18n.ts.featured }}</option>
			<option :value="null">{{ i18n.ts.notes }}</option>
			<option value="all">{{ i18n.ts.all }}</option>
			<option value="files">{{ i18n.ts.withFiles }}</option>
		</MkTab>
	</template>
	<MkNotes :noGap="true" :pagination="pagination" :class="$style.tl"/>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { ref, computed, provide } from 'vue';
import * as Misskey from 'misskey-js';
import MkNotes from '@/components/MkNotes.vue';
import MkTab from '@/components/MkTab.vue';
import { i18n } from '@/i18n.js';
import { $i } from '@/i.js';
import { prefer } from '@/preferences.js';

const props = defineProps<{
	user: Misskey.entities.UserDetailed;
}>();

const tab = ref<string | null>('all');
const include = ref<string | null>('all');
provide<boolean>('collapseSensitiveChannel', prefer.s.collapseSensitiveChannel);

const pagination = computed(() => tab.value === 'featured' ? {
	endpoint: 'users/featured-notes' as const,
	limit: 10,
	params: {
		userId: props.user.id,
	},
} : {
	endpoint: 'users/notes' as const,
	limit: 10,
	params: {
		userId: props.user.id,
		withRenotes: tab.value === 'all',
		withReplies: tab.value === 'all',
		withChannelNotes: tab.value === 'all',
		withFiles: tab.value === 'files',
		includeSensitiveChannel: $i != null,
	},
});
</script>

<style lang="scss" module>
.tab {
	padding: calc(var(--MI-margin) / 2) 0;
	background: var(--MI_THEME-bg);
}

.tl {
	background: var(--MI_THEME-bg);
	border-radius: var(--MI-radius);
	overflow: clip;
}
</style>
