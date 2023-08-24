<script>
	let hidden = true;

	function toggleMobileMenu() {
		hidden = !hidden;
	}
</script>

<div class="bg-teal-500 text-white flex justify-between p-1">
	<div class="flex mx-4 items-center">
		<div class="p-1">
			<a href="/">
				<img src="/balloon_icon.png" alt="logo" />
			</a>
		</div>

		<div class="mx-3 my-1 flex flex-col">
			<h1 class="text-xl">U4B.LIVE</h1>
			<span class="text-m">High Altitude Balloon Tracker</span>
		</div>
	</div>
	<div class="hidden md:flex mx-4 justify-center items-center">
		<ul class="flex">
			<li class="mx-2 hover:underline"><a href="/about">About</a></li>
			<li class="mx-2 hover:underline"><a href="#">Tracking Log</a></li>
			<li class="mx-2 hover:underline"><a href="#">Contact</a></li>
			<li class="mx-2 hover:underline"><a href="#">Links</a></li>
		</ul>
	</div>
	<div class="md:hidden mx-4 p-4">
		<button on:click={toggleMobileMenu}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	</div>
</div>
<div class:hidden class="md:hidden bg-teal-500 text-white">
	<a href="#" class="p-2 block hover:bg-teal-400 py-2">About</a>
	<a href="#" class="p-2 block hover:bg-teal-400 py-2">Tracking Log</a>
	<a href="#" class="p-2 block hover:bg-teal-400 py-2">Contact</a>
	<a href="#" class="p-2 block hover:bg-teal-400 py-2">Links</a>
</div>
