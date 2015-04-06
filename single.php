<?php get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>

<section class="map-wrapper">
	
	<div id="map"></div>

</section>

<section class="single-bg">

	<div class="container">
	
		<h1>
			<i class="icon-bike"><?php include ( get_stylesheet_directory() . '/img/icon-bike-alt.svg' ); ?></i>
			<?php the_title(); ?>
		</h1>
	
	</div>

</section>

<main class="container">

		<article class="route-info">

			<div id="single-infobox"></div>

			<div class="route-description">

				<div class="route-content span7">
					<?php the_content(); ?>
				</div>

				<div class="route-image span5">
					<?php the_post_thumbnail( 'large' ); ?>
				</div>

			</div>

		</article>

</main>

<?php endwhile; ?>

<section class="container pagination">

	<div class="spread">
		<div class="previous span6"><?php previous_post_link(); ?> <span>Previous</span></div>
		<div class="next span6"><?php next_post_link();?> <span>Next</span></div>
	</div>

</section>

<?php get_footer();