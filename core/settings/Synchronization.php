<?php

namespace IASD\Core\Settings;

class Synchronization {

  public function __construct() {
    add_action('admin_enqueue_scripts', array($this, 'enqueueAdminAssets'));
    add_action('admin_menu',            array($this, 'createMenu'));
    add_action('admin_bar_menu',        array($this, 'addToolbar'), 999);
  }
  
  /**
   * enqueueAdminAssets Enqueues scripts for admin
   *
   * @return void
   */
  function enqueueAdminAssets(): void {
    if(!Modules::isActiveModule('blocks') && (Modules::isActiveModule('taxonomies') || !Modules::isActiveModule('taxonomiessync')))
      return;

    wp_enqueue_script('sync-admin-script', get_template_directory_uri() . '/core/assets/scripts/admin.js', array('jquery'));
  }
  
  /**
   * createMenu Create a new menu item
   *
   * @return void
   */
  function createMenu(): void {
    if(!Modules::isActiveModule('blocks') && (Modules::isActiveModule('taxonomies') || !Modules::isActiveModule('taxonomiessync')))
      return;
      
    add_options_page(
      __('Synchronization', 'iasd'),
      __('Synchronization', 'iasd'),
      'manage_options',
      'synchronization',
      array($this, 'renderPage')
    );
  }
  
  /**
   * renderPage Render the page
   *
   * @return void
   */
  function renderPage(): void {
    $blocks     = Modules::isActiveModule('blocks');
    $taxonomies = Modules::isActiveModule('taxonomies') && Modules::isActiveModule('taxonomiessync');
    ?>
    <div class="wrap">
      <h1><?= __('Synchronization', 'iasd') ?></h1>
      <p class="description"><?= __('Sync site data from remote sources.', 'iasd') ?></p>

      <div class="iasd-sync-notices" aria-live="polite"></div>

      <?php if($blocks && $taxonomies): ?>
        <p>
          <button type="button" class="button button-primary button-large" data-sync="all">
            <?= __('Sync all', 'iasd') ?>
          </button>
          <span class="spinner" style="float:none;vertical-align:middle;"></span>
        </p>
      <?php endif; ?>

      <?php if($blocks): ?>
        <div class="postbox">
          <div class="postbox-header">
            <h2 class="hndle"><?= __('Blocks', 'iasd') ?></h2>
          </div>
          <div class="inside">
            <p><?= __('Sync block data from the remote source.', 'iasd') ?></p>
            <p>
              <button type="button" class="button button-primary" data-sync="blocks">
                <?= __('Sync blocks', 'iasd') ?>
              </button>
              <span class="spinner" style="float:none;vertical-align:middle;"></span>
            </p>
          </div>
        </div>
      <?php endif; ?>

      <?php if($taxonomies): ?>
        <div class="postbox">
          <div class="postbox-header">
            <h2 class="hndle"><?= __('Taxonomies', 'iasd') ?></h2>
          </div>
          <div class="inside">
            <p><?= __('Sync taxonomy data from the remote source.', 'iasd') ?></p>
            <p>
              <button type="button" class="button button-primary" data-sync="taxonomies">
                <?= __('Sync taxonomies', 'iasd') ?>
              </button>
              <span class="spinner" style="float:none;vertical-align:middle;"></span>
            </p>
          </div>
        </div>
      <?php endif; ?>
    </div>
    <?php
  }
  
  /**
   * addToolbar Adds a toolbar tom run synchronization
   *
   * @param  object $wp_admin_bar The toolbar object
   * 
   * @return void
   */
  function addToolbar(object $wp_admin_bar): void {
    $blocks     = Modules::isActiveModule('blocks');
    $taxonomies = Modules::isActiveModule('taxonomies') && Modules::isActiveModule('taxonomiessync');

    if(!$blocks && !$taxonomies)
      return;
      
    $wp_admin_bar->add_node([
        'id'    => 'sync_remote_data',
        'title' => __('Sync data', 'iasd'),
        'href'  => '#',
        'meta'  => [
            'onclick' => $blocks && $taxonomies ? 'syncRemoteData(event)' : ($blocks ? 'syncBlocks(event)' : 'syncTaxonomies(event)'),
        ],
    ]);

    if($blocks):
      $wp_admin_bar->add_node([
        'id'     => 'sync_blocks',
        'title'  => __('Sync blocks', 'iasd'),
        'parent' => 'sync_remote_data',
        'href'   => '#',
        'meta'   => [
            'onclick' => 'syncBlocks(event)',
        ],
      ]);
    endif;
    
    if($taxonomies):
      $wp_admin_bar->add_node([
        'id'     => 'sync_taxonomies',
        'title'  => __('Sync taxonomies', 'iasd'),
        'parent' => 'sync_remote_data',
        'href'   => '#',
        'meta'   => [
            'onclick' => 'syncTaxonomies(event)',
        ],
      ]);
    endif;
  }

}

new Synchronization;
