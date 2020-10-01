		<?php get_header(); ?>
		<?php 
			require(get_template_directory() . '/components/front-page/slider.php'); 
		?>
			<section class="pa-content pb-5">

				<?php require(get_template_directory() . '/components/widgets/pa-find-church.php'); ?>
				<div class="pa-widgets">
					<div class="container">
						<div class="row row-cols-auto">
							<?php 
								require(get_template_directory() . "/components/widgets/pa-noticias.php");
								require(get_template_directory() . "/components/widgets/pa-destaque.php");
							?>
						</div>
					</div>
				</div>

				<?php require(get_template_directory() . "/components/widgets/pa-feliz7play.php"); ?>
				<div class="pa-widgets">
					<div class="container">
						<div class="row row-cols-auto">
							<?php 
								$tamanho = '1/3';
								require(get_template_directory() . "/components/widgets/pa-videos.php");
								require(get_template_directory() . "/components/widgets/pa-artigos.php");
								require(get_template_directory() . "/components/widgets/pa-app.php");

								$tamanho = '2/3';
								require(get_template_directory() . "/components/widgets/pa-videos.php");
								require(get_template_directory() . "/components/widgets/pa-downloads.php");
								require(get_template_directory() . "/components/widgets/pa-botoes.php");
								require(get_template_directory() . "/components/widgets/pa-destaque-depto.php");
							?>
						</div>
					</div>
				</div>
			</section>
			<?php get_footer();?>