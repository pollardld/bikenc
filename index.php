<?php get_header(); ?>

	<section class="map-wrapper">
		<div class='custom-popup' id="map"></div>
		<div class="map-overlay">
			<h4>Biking North Carolina</h4>
			<p>Plan your trip across the beautiful state of North Carolina with turn-by-turn directions, destination information, and elevation profiles.</p>
			<a href="/map/" class="planner-link">Plan Your Trip</a>
		</div>
		<div id="infobox"></div>
	</section>

	<main>
		<section class="route-wrapper">
			<div class="route-wrapper-title">
				<h5>BROWSE ALL ROUTES</h5>
			</div>
			<?php while ( have_posts() ) : the_post(); ?>

				<article <?php post_class(); ?>>

					<div class="route-svg">

						<a href="<?php the_permalink(); ?>">More about <?php the_title(); ?></a>

						<?php
							$routeSVG = get_field( 'route_svg' );

						if ( $routeSVG ) : ?>
							<object type="image/svg+xml" data="<?php echo $routeSVG['url']; ?>"></object>
						<?php endif; ?>

					</div>

					<div class="route-info">

						<a href="<?php the_permalink(); ?>"><h2><?php the_title(); ?></h2></a>

						<div class="route-description">
							<?php the_content(); ?>
						</div>

						<div class="route-details">
							<a href="<?php the_permalink(); ?>" class="more-detail">Find Out More <span>&rsaquo;</span></a>
						</div>

					</div>

				</article>

			<?php endwhile; ?>

		</section>

	</main>

<?php get_footer(); ?>