<template>
	<view>
		<view class="spinner-inside" >
			<view class="object" id="first_object"></view>
			<view class="object" id="second_object"></view>
			<view class="object" id="third_object"></view>
			<view class="object" id="forth_object"></view>
		</view>	
	</view>
</template>
<script>
	export default {
		name: 'blockract',
		props: {
			color: String,
			size: Number
		}
	};
</script>
<style scoped>
	.spinner-inside {
		margin: 25px auto;
		text-align: center;
		font-size: 10px;
	}
	.object{
		width: 12px;
		height: 12px;
		border: 1px solid #16c4af;
		position: absolute;
	}

	#first_object{
		-webkit-animation: first_object 1s infinite;
		animation: first_object 1s infinite;
		-webkit-animation-delay: 0.5s; 
	    animation-delay: 0.5s; 
	}
	#second_object{
		-webkit-animation: second_object 1s infinite;
		animation: second_object 1s infinite;
	}	
	#third_object{
		-webkit-animation: third_object 1s infinite;
		animation: third_object 1s infinite;
		-webkit-animation-delay: 0.5s; 
	    animation-delay: 0.5s; 
	}	
	#forth_object{
		-webkit-animation: forth_object 1s infinite;
		animation: forth_object 1s infinite;
	}	
	@-webkit-keyframes first_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
	    -ms-transform: translate(150%,150%) scale(2,2); 
	   	-webkit-transform: translate(150%,150%) scale(2,2); 
	    transform: translate(150%,150%) scale(2,2);
		 }
		 
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }	 
	}		
	@keyframes first_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
	    -ms-transform: translate(150%,150%) scale(2,2); 
	   	-webkit-transform: translate(150%,150%) scale(2,2); 
	    transform: translate(150%,150%) scale(2,2);
		 }
		 
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	}
	@-webkit-keyframes second_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
		-ms-transform: translate(-150%,150%) scale(2,2); 
	   	-webkit-transform: translate(-150%,150%) scale(2,2);
	    transform: translate(-150%,150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	}		
	@keyframes second_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
		-ms-transform: translate(-150%,150%) scale(2,2); 
	   	-webkit-transform: translate(-150%,150%) scale(2,2);
	    transform: translate(-150%,150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	}
	@-webkit-keyframes third_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }	
	 50% {
		-ms-transform: translate(-150%,-150%) scale(2,2); 
	   	-webkit-transform: translate(-150%,-150%) scale(2,2);
	    transform: translate(-150%,-150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }	
	}		
	@keyframes third_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }	
	 50% {
		-ms-transform: translate(-150%,-150%) scale(2,2); 
	   	-webkit-transform: translate(-150%,-150%) scale(2,2);
	    transform: translate(-150%,-150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	}
	@-webkit-keyframes forth_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
		-ms-transform: translate(150%,-150%) scale(2,2); 
	   	-webkit-transform: translate(150%,-150%) scale(2,2);
	    transform: translate(150%,-150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }	
	}		
	@keyframes forth_object {
	 0% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	 50% {
		-ms-transform: translate(150%,-150%) scale(2,2); 
	   	-webkit-transform: translate(150%,-150%) scale(2,2);
	    transform: translate(150%,-150%) scale(2,2);
		}
	 100% {
	    -ms-transform: translate(1,1) scale(1,1); 
	   	-webkit-transform: translate(1,1) scale(1,1); 
	    transform: translate(1,1) scale(1,1); 
		 }
	}
	</style>

	
