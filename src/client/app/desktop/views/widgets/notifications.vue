<template>
<div class="mkw-notifications">
	<ui-container :show-header="!props.compact">
		<template #header><fa :icon="['far', 'bell']"/>{{ props.type === 'all' ? $t('title') : $t('title') + ' (' + $t('@.notification-types.' + props.type) + ')' }}</template>
		<template #func><button :title="$t('@.notification-type')" @click="settings" :class="{ filtered }"><fa :icon="faFilter"/></button></template>

		<mk-notifications :class="$style.notifications" :type="props.type === 'all' ? null : props.type"/>
	</ui-container>
</div>
</template>

<script lang="ts">
import define from '../../../common/define-widget';
import i18n from '../../../i18n';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default define({
	name: 'notifications',
	props: () => ({
		compact: false,
		type: 'all'
	})
}).extend({
	i18n: i18n('desktop/views/widgets/notifications.vue'),
	data() {
		return {
			faFilter,
		};
	},
	computed: {
		filtered(): Boolean {
			return this.props.type !== 'all';
		},
	},
	methods: {
		settings() {
			if (this.filtered) {
				this.props.type = 'all';
				return;
			}

			this.$root.dialog({
				title: this.$t('@.notification-type'),
				type: null,
				select: {
					items: ['all', 'follow', 'mention', 'reply', 'renote', 'quote', 'reaction', 'pollVote', 'receiveFollowRequest'].map(x => ({
						value: x, text: this.$t('@.notification-types.' + x)
					}))
					default: this.props.type,
				},
				showCancelButton: true
			}).then(({ canceled, result: type }) => {
				if (canceled) return;
				this.props.type = type;
				this.save();
			});
		},
		func() {
			this.props.compact = !this.props.compact;
			this.save();
		}
	}
});
</script>

<style lang="stylus" module>
.notifications
	max-height 300px
	overflow auto
</style>

<style lang="stylus" scoped>
.filtered
	color var(--primary) !important
</style>
