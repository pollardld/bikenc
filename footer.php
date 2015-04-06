<div class="footer-bg">

	<footer>

		<?php if ( is_active_sidebar( 'footer_widget' ) ) : ?>
			<div class="span3 about-widget">
				<?php dynamic_sidebar( 'footer_widget' ); ?>
			</div>
		<?php endif; ?>

		<div class="span7">

			<ul class="footer-routes">

				<li>Routes</li>

				<li>

					<ul class="sub-menu">

						<?php
						$args = array(
							'post_type' => 'routes',
							'order' => 'ASC'
						);

						$the_query = new WP_Query( $args );

						if ( $the_query->have_posts() ) :

							while ( $the_query->have_posts() ) : $the_query->the_post(); ?>

								<li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>

							<?php endwhile;
								  wp_reset_query();
						endif; ?>

					</ul>

				</li>
		</div>

		<div class="span2 footer-widget">

			<?php wp_nav_menu( array(
				'theme_location' => 'footer-menu',
				'container' => false,
				'items_wrap' => '<ul class="footer-nav">%3$s</ul>'
			)); ?>


			<?php if ( is_active_sidebar( 'footer_contact' ) ) : ?>

				<ul class="footer-nav">

					<a href="/contact/">Contact</a>

					<li>

						<?php dynamic_sidebar( 'footer_contact' ); ?>

					</li>

				</ul>

			<?php endif; ?>

		</div>

	</footer>

</div>

<?php include_once("analyticstracking.php") ?>

<?php wp_footer(); ?>
</body>
</html>