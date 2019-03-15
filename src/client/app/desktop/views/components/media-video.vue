<template>
<a :href="video.url" @click.prevent="onClick">
	<div class="col" :style="style">
		<img :src="thumbnail" :title="video.name">
		<fa class="icon" :icon="['far', 'play-circle']"/>
	</div>
</a>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import MkMediaVideoDialog from './media-video-dialog.vue';

export default Vue.extend({
	i18n: i18n('desktop/views/components/media-video.vue'),
	props: {
		video: {
			type: Object,
			required: true
		},
		inlinePlayable: {
			default: false
		}
	},
	data() {
		return {
			hide: true
		};
	},
	computed: {
		thumbnail(): any {
			return this.video.thumbnailUrl;
		},
	},
	methods: {
		onClick() {
			const videoTag = this.$refs.video as (HTMLVideoElement | null)
			var start = 0
			if (videoTag) {
				start = videoTag.currentTime
				videoTag.pause()
			}
			this.$root.new(MkMediaVideoDialog, {
				video: this.video,
				start,
			})
		}
	}
})
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
			min-width 160px
			object-fit contain

		.icon
			position absolute
			top 50%
			left 50%
			transform translate(-50%,-50%)
			font-size 3em
</style>
