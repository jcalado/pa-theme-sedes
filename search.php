<?php

/* Template name: Search */

get_header();

// Adventistas PT
$cx = "62123640d9135455e";

if (isset($_GET['q'])) {
  $search = htmlspecialchars($_GET['q']);
} else {
  $search = '';
}

require(get_template_directory() . '/components/parent/header.php');
?>

<section class="pa-search">
  <div class="container">
    <div class="row">
      <div class="col">
        <header class="my-5">
          <h1 class="h2"><?= _e('Results for:', 'iasd'); ?> <b><?php echo $search; ?></b></h1>
          <form method="get" action="<?php echo site_url(); ?>/procurar/?" class="search_form">
            <div class="input-group mt-4">
              <input type="text" name="q" class="form-control" value="<?php echo $search; ?>">
              <span class="input-group-btn">
                <button class="btn btn-default" type="submit"><?= _e('Search', 'iasd'); ?></button>
              </span>
            </div>
          </form>
        </header>
        <content>
          <script async src="https://cse.google.com/cse.js?cx=<?php echo $cx; ?>"></script>
          <div class="gcse-searchresults-only" data-sort_by="date"></div>
        </content>
      </div>
    </div>
  </div>
</section>

<?php get_footer(); ?>
