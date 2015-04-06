<?php get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>

<section class="page-bg svg-bg">

	<?php the_post_thumbnail( 'large' ); ?>

</section>

<div class="title-wrap">
	
	<div class="container">
		
		<h1><?php the_title(); ?></h1>
	
	</div>

</div>

<main class="container">

	<section class="page-content">
	
		<article>
			<?php the_content(); ?>
		</article>

	</section>
				
</main>

<?php endwhile; ?>

<?php get_footer(); ?>