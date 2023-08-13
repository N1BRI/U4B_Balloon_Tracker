<script>
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<div class="navbar">
	<div class="logo">
		<img src="/balloon_icon.png" alt="logo">
		<h3>U4B.LIVE <small>High Altitude Balloon Tracker</small></h3>
	</div>
	<div class="menu-icon" on:click={toggleMobileMenu}>&#9776;</div>
	<ul class:active={isMobileMenuOpen} class="nav-links">
		<li><a href="#">About</a></li>
		<li><a href="#">Contact</a></li>
		<li><a href="#">Links</a></li>
	</ul>
</div>

<style>
	/* Navbar styles */
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #00abab;
		color: white;
		padding: 5px;
	}

	.logo {
		display: flex;
		align-items: center;
	}
	small{
		color: white;
	}

	.logo img {
		width: 40px;
		height: 40px;
		margin-right: 10px;
		color: white;
	}

	.menu-icon {
		font-size: 1.5rem;
		cursor: pointer;
		display: none; /* Hide by default on larger screens */
	}

	.nav-links {
		list-style: none;
		display: flex;
		margin: 0;
	}

	.nav-links li {
		margin-right: 20px;
	}

    .nav-links li:hover{
        text-decoration: underline;
    }

	.nav-links a {
		text-decoration: none;
		color: white;
	}

	/* Responsive styles */
	@media (max-width: 768px) {
		.menu-icon {
			display: block; /* Show on smaller screens */
			margin-right: 10px;
		}

		.nav-links {
			display: none; /* Hide by default on smaller screens */
			flex-direction: column;
			position: absolute;
			top: 60px;
			right: 0;
			width: 100%;
			background-color: #00abab;
		}

		.nav-links.active {
			display: flex; /* Show when active */
		}

		.nav-links li {
			text-align: center;
			margin: 0;
			padding: 10px 0;
		}
	}
</style>
