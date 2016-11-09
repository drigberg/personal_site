function guiinit(){
	var bg = '#E4E4E4';
	var fg = '#2a6496';

	function load(){
  		$('#canvas').show();
  		$('#canvas2').show();

  		$('#canvas').animate({
  			opacity : 1
  		},1000);

  		$('#canvas2').animate({
  			opacity : 1
  		},1000);

  		$('#help').animate({
  			opacity : 0
  		},1000,function(){
  			$('#help').hide();
  			helpvisible = false;
  		});
	}

	$('#canvas2').hide();
	$('#canvas').hide();
	$('.sample').hover(function(){
		$(this).css('opacity','0.5');
	},function(){
		$(this).css('opacity','1');
	});

	$('#sample1').click(function(){
		load();
	});

	$('#sample2').click(function(){
		//loading the sound with XML HTTP REQUEST

		var request = new XMLHttpRequest();
			request.open('GET','audio/synth.mp3',true);
			request.responseType = "arraybuffer";
			request.onload = function(){
				context.decodeAudioData(request.response,function(b){
					buffer = b; //set the buffer
					data = buffer.getChannelData(0);
					isloaded = true;
					var canvas1 = document.getElementById('canvas');
					//initialize the processing draw when the buffer is ready
					var processing = new Processing(canvas1,waveformdisplay);
					load();

				},function(){
					console.log('loading failed');
					alert('loading failed');

				});
			};
		request.send();


	});

	//drop
	var drop = document.getElementById('waveform');

	drop.addEventListener("dragover",function(e){
    //prevents from loading the file in a new page
   	 e.preventDefault();
	},false);
	drop.addEventListener('drop',function(e){
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		var reader = new FileReader();
    	reader.onload = function(e){
    		var array = e.target.result;
    		context.decodeAudioData(array,function(b){

    			buffer = b
    			data = buffer.getChannelData(0);
    			var canvas1 = document.getElementById('canvas');
    			var processing = new Processing(canvas1,waveformdisplay);
    			load();

    		},function(){
    			console.log('loading failed');
    			alert('loading failed');
    		});
    	}
    	reader.readAsArrayBuffer(file);
	},false);
}
