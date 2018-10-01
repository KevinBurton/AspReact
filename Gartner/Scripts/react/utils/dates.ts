export function toLocalDate(dateString: string, format: string = 'DD MMM YYYY hh:mm A'): string {
	return moment(new Date(dateString + ' UTC')).local().format(format);
}

