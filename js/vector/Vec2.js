/**
 * 2D Vector
 * @author Dave Taylor <dave.taylor@pogokid.com>
 */

(function(global) {
	'use strict';

	var Vec2 = function( x, y ) {
		this.listeners = [];
		this.set( x, y );
	};
	Vec2.scalar = function(s){
		return { x: s, y: s };
	};
	Vec2.prototype = {
		// simple events
		on: function( eventName, fn ) {
			this.listeners[eventName] = this.listeners[eventName] || [];
			this.listeners[eventName].push( fn );
			return this;
		},
		_trigger: function( eventName ) {
			if ( this.listeners[eventName] ) {
				for ( var i = 0; i < this.listeners[eventName].length; i++ ) {
					this.listeners[eventName][i].call( this );
				}
			}
			return this;
		},

		// the core place to set the values
		set: function( x, y ) {
			this.x = x;
			this.y = typeof y === 'undefined' ? x : y;
			this._trigger( 'set' );
			return this;
		},

		// the maths
		plus: function( v ) {
			return this.set(
				this.x + v.x,
				this.y + v.y
			);
		},
		minus: function( v ) {
			return this.set(
				this.x - v.x,
				this.y - v.y
			);
		},
		mult: function( v ) {
			return this.set(
				this.x * v.x,
				this.y * v.y
			);
		},
		div: function( v ) {
			return this.set(
				this.x / v.x,
				this.y / v.y
			);
		},
		mod: function( v ) {
			return this.set(
				this.x % v.x,
				this.y % v.y
			);
		},
		inv: function(){
			return this.set(
				this.x*=-1,
				this.y*=-1
			);
		},
		normalize: function(){
			var mag = this.mag();
			return this.div({
				x: mag,
				y: mag
			});
		},
		mag: function(){
			return Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2));
		},

		// functions which return a new instance
		Plus: function( v ) {
			return this.clone().plus( v );
		},
		Minus: function( v ) {
			return this.clone().minus( v );
		},
		Mult: function( v ) {
			return this.clone().mult( v );
		},
		Div: function(v){
			return this.clone().div(v);
		},
		Mod: function( v ) {
			return this.clone().mod( v );
		},
		Inv: function(){
			return this.clone().inverse();
		},
		Normalize: function(){
			return this.clone().normalize();
		},


		// helpers
		copy: function( v ) {
			return this.set(v.x, v.y);
		},
		clone: function() {
			var v = new Vec2();
			return v.copy( this );
		},
		equals   : function( v ) {
			return this.x === v.x && this.y === v.y;
		},

		// other helpers
		distance : function( v ) {
			return Math.sqrt( Math.pow( (v.x - this.x), 2 ) + Math.pow( (v.y - this.y), 2 ) );
		}

	};

	if (typeof exports !== 'undefined') {
		module.exports = Vec2;
	} else if (global.define && global.define.amd) {
		define(function(){ return Vec2; });
	} else {
		global.Vec2 = Vec2;
	}

})(this);