class Sum {
	constructor(a, b) {
		this.a = a
		this.b = b
	}
	add() {
		return this.a + this.b
	}
	reduce() {
		return this.a - this.b
	}
}
Sum.prototype.say = function() {
	console.log('saysaysay')
}

const ass = new Sum(100, 50)
ass.say()
ass.add()
ass.reduce()