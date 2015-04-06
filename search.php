<?php get_header();

if ( have_posts() ) : ?>

	<main class="container">
				
		<h1><?php printf( __( 'Search Results for: %s', 'walkbikenc' ), get_search_query() ); ?></h1>

		<?php while ( have_posts() ) : the_post(); ?>

			<article>

				<a href="<?php the_permalink(); ?>"><h5><?php the_title(); ?></h5></a>

				<p><?php the_excerpt(); ?></p>

			</article>

		<?php endwhile; ?>

	</main>

<?php else : ?>

	<main class="container">
				
		<h1><?php printf( __( 'Search Results for: %s', 'walkbikenc' ), get_search_query() ); ?></h1>

		<h4>No Results</h4>

		<p>Try another search</p>

		<?php get_search_form(); ?>

	</main>

<?php endif; ?>

<?php get_footer(); ?>