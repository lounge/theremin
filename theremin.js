


(function run() {

	var leftOutput = document.getElementById('left');
	var rightOutput = document.getElementById('right');
	var iBox;

	window.audioContext = new (window.AudioContext || window.webkitAudioContext)();

	// Analyzer
	var analyser = window.audioContext.createAnalyser();
	var canvas = document.getElementById('visualizer');
	// canvas.setAttribute('width',intendedWidth);

	var drawVisual;
	var canvasCtx = canvas.getContext("2d");
	WIDTH = canvas.width;
  HEIGHT = canvas.height;



	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

	analyser.fftSize = 2048;
	analyser.getByteTimeDomainData(dataArray);

	// Sounds
	var oscillator = window.audioContext.createOscillator();
	var gain = window.audioContext.createGain();

	gain.gain.value = 0;
	gain.connect(window.audioContext.destination);

	oscillator.connect(gain);



	if (oscillator.start) {
		oscillator.start(0);
	}
	else {
	  oscillator.noteOn(0);
	}


	// var mouse = { x: 0, y: 0 };
	var theremin = document.getElementById('theremin');

	function update(hands) {
		hands.forEach(function(hand, index) {
			var normalizedPoint = iBox.normalizePoint(hand.palmPosition, true);
			if(hand.type == "left") {
		    	oscillator.frequency.value = Math.pow(normalizedPoint[1], 2) * (3520 - 44) + 44;
		    	leftOutput.innerHTML = 'Pitch:' + normalizedPoint[1]
			}
			else {
				gain.gain.value = Math.pow(normalizedPoint[0], 2);
				rightOutput.innerHTML = 'Volume:' + normalizedPoint[0];
			}
		});
	}


	function draw() {
	    var drawVisual = requestAnimationFrame(draw);

	    analyser.getByteTimeDomainData(dataArray);

	    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
	    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

	    canvasCtx.lineWidth = 2;
	    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

	    canvasCtx.beginPath();

	    var sliceWidth = WIDTH * 1.0 / bufferLength;
	    var x = 0;

	    for(var i = 0; i < bufferLength; i++) {

		    var v = dataArray[i] / 128.0;
		    var y = v * HEIGHT/2;

		    if(i === 0) {
		      canvasCtx.moveTo(x, y);
		    } else {
		      canvasCtx.lineTo(x, y);
		    }

		    x += sliceWidth;
	    }

	  	canvasCtx.lineTo(canvas.width, canvas.height/2);
	  	canvasCtx.stroke();
    };


	// theremin.addEventListener('mousemove', function (event) {
	//     mouse.x = (event.pageX - theremin.offsetLeft) / 500;
	//     mouse.y = 1 - (event.pageY - theremin.offsetTop) / 500;
	//     update();
	// });

	// theremin.addEventListener('click', function (event) {
	//     on = !on;
	//     update();
	// });



	Leap.loop(function (frame) {
    	iBox = frame.interactionBox;

    	update(frame.hands);
    	// draw();
	});

	draw();

}());
