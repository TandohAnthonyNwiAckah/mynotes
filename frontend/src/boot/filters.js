import { date } from 'quasar'

export default ({ Vue }) => {
	Vue.filter('capitalize', function (value) {
		if (!value) return ''
		value = value.toString()
		return value.charAt(0).toUpperCase() + value.slice(1)
	}),

		Vue.filter('readable', function (value) {
			if (!value) return ''
			return value.replace(/[^a-zA-Z0-9]/g, ' ');
		}),
		Vue.filter('humanDate', function (value) {
			if (!value) return ''
			if (!date.isValid(value)) {
				return value;
			}
			let timeStamp = new Date(value);
			return date.formatDate(timeStamp, 'Do MMM, YYYY');
		}),
		Vue.filter('humanTime', function (value) {
			if (!value) return ''
			if (!date.isValid(value)) {
				return value;
			}
			let timeStamp = new Date(value);
			return date.formatDate(timeStamp, 'hh:mm');
		}),
		Vue.filter('humanDatetime', function (value) {
			if (!value) return ''
			if (!date.isValid(value)) {
				return value;
			}
			let timeStamp = new Date(value);
			return date.formatDate(timeStamp, 'Do MMM, YYYY hh:mm');
		}),
		Vue.filter('relativeDate', function (value) {
			let dateFormats = [
				{ unit: 'years', msg: 'year' },
				{ unit: 'months', msg: 'month' },
				{ unit: 'days', msg: 'day' },
				{ unit: 'hours', msg: 'hour' },
				{ unit: 'minutes', msg: 'min' },
				{ unit: 'seconds', msg: 'sec' }
			];

			if (!date.isValid(value)) {
				return value;
			}
			let oldDate = new Date(value);
			let nowDate = new Date();

			let when = "ago";
			if (oldDate > nowDate) {
				when = "from now"
			}
			let format;
			let diff;
			for (let i = 0; i < dateFormats.length; i++) {
				format = dateFormats[i];
				diff = Math.abs(date.getDateDiff(oldDate, nowDate, format.unit));
				if (diff > 0) {
					break;
				}
			}
			let displayUnit = format.msg
			if (diff > 1) {
				displayUnit += "s";
			}

			return diff + " " + displayUnit + " " + when;
		}),

		Vue.filter('approximate', function (num, precision) {
			return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
		}),

		Vue.filter('lower', function (value) {
			return value || value === 0 ? value.toString().toLowerCase() : '';
		}),

		Vue.filter('upper', function (value) {
			return value || value === 0 ? value.toString().toUpperCase() : '';
		}),

		Vue.filter('truncate', function (value, length, dots) {
			length = length || 15;
			dots = dots || "...";
			if (!value || typeof value !== 'string') return '';
			if (value.length <= length) return value;
			return value.substring(0, length) + dots;
		}),

		Vue.filter('currency', function (value, currency, fraction) {
			currency = currency || "USD";
			fraction = fraction || 2;
			var formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
				minimumFractionDigits: fraction
			});
			return formatter.format(value);
		})
}