Cube.anim.Animator = function(attributes) {
    this.range = attributes.range;
    this.delay = attributes.delay;
    // attributes.ease = attributes.ease;
    // this.repeat = attributes.repeat;
    this.current = 0.0;
    this.sinks = [];
};

Cube.anim.Animator.prototype = {};
Cube.anim.Animator.prototype.constructor = Cube.anim.Animator;
Cube.anim.Animator.prototype.animate = function(deltaT) {
    this.current += deltaT;
    this.current %= this.delay;
    var val = this.range.at(this.current/this.delay);
    this.sinks.forEach(function(sink) {
        sink(val);
    });
    return val;
};
Cube.anim.Animator.prototype.bind = function(what) {
    this.sinks.push(what);
    return this;
};

