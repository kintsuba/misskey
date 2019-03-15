<template>
<a :href="image.url" @click.prevent="onClick">
	<div class="col" :style="style">
		<img :src="thumbnail" :title="image.name">
		<div class="badge" v-if="image.type === 'image/gif'">GIF</div>
	</div>
</a>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import ImageViewer from './image-viewer.vue';
import { getStaticImageUrl } from '../../../common/scripts/get-static-image-url';

export default Vue.extend({
	i18n: i18n('common/views/components/media-image.vue'),
	props: {
		image: {
			type: Object,
			required: true
		},
		raw: {
			default: false
		}
	},
	data() {
		return {
			hide: true
		};
	},
	computed: {
		thumbnail(): string {
			return this.$store.state.device.disableShowingAnimatedImages
				? getStaticImageUrl(this.image.thumbnailUrl)
				: this.image.thumbnailUrl;
		},
		style(): any {
			return {
				'background-color': this.image.properties.avgColor && this.image.properties.avgColor.length == 3 ? `rgb(${this.image.properties.avgColor.join(',')}, 0.3)` : 'transparent',
			};
		}
	},
	methods: {
		onClick() {
			this.$root.new(ImageViewer, {
				image: this.image
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
a
	display contents

	.col
		flex-grow 1
		display flex
		justify-content center
		margin 3px
		padding 0
		border-radius 3px

		img
			height: 120px
			max-width 100%
			object-fit contain
		
		.badge
			position absolute
			top 0
			left 0
			background-color var(--text)
			border-radius 3px
			color var(--secondary)
			opacity 0.5
			padding 0 3px
</style>
