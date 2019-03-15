<template>
<div class="mk-media-list">
	<template v-for="media in mediaList.filter(media => !previewable(media))">
		<x-banner :media="media" :key="media.id"/>
	</template>
	<div v-if="mediaList.filter(media => previewable(media)).length > 0" class="container">
		<button v-if="hasNsfw" @click="maskNsfw = !maskNsfw">
			<b>
				<fa icon="exclamation-triangle"/> {{ maskNsfw ? $t('show-nsfw') : $t('hide-nsfw') }}
			</b>
		</button>
		<div v-if="!hasNsfw || !maskNsfw" :data-count="mediaList.filter(media => previewable(media)).length" class="list" :class="{ masked }">
			<template v-for="media in mediaList">
				<mk-media-video :video="media" :key="media.id" v-if="media.type.startsWith('video')"/>
				<x-image :image="media" :key="media.id" v-else-if="media.type.startsWith('image')" :raw="raw"/>
			</template>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import XBanner from './media-banner.vue';
import XImage from './media-image.vue';

export default Vue.extend({
	i18n: i18n('common/views/components/media-list.vue'),
	components: {
		XBanner,
		XImage
	},
	props: {
		mediaList: {
			required: true
		},
		raw: {
			default: false
		}
	},
	data() {
		return {
			maskNsfw: true,
		};
	},
	mounted() {
		this.maskNsfw = !this.$store.state.device.alwaysShowNsfw;
	},
	computed: {
		masked(): Boolean {
			return this.hasNsfw && this.maskNsfw;
		},
		hasNsfw(): Boolean {
			return this.mediaList && this.mediaList.filter((media: any) => media.isSensitive).length > 0
		},
	},
	methods: {
		previewable(file) {
			return file.type.startsWith('video') || file.type.startsWith('image');
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-media-list
	> .container
		overflow hidden

		button
			display inline-block
			padding 4px 8px
			font-size 0.7em
			color var(--cwButtonFg)
			background var(--cwButtonBg)
			border-radius 2px
			cursor pointer
			user-select none

			&:hover
				background var(--cwButtonHoverBg)

		> .list
			display flex
			flex-direction row
			flex-wrap wrap
</style>
