function promiseDemo() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('finish')
		}, 2000);
	})
}


promiseDemo().then(res => {
	console.log('res:', res)
})