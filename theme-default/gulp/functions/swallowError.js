export function call(error) {
	console.log(error.toString());
	this.emit('end');
}
