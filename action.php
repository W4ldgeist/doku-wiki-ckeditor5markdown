<?php

use dokuwiki\Extension\ActionPlugin;
use dokuwiki\Extension\EventHandler;
use dokuwiki\Extension\Event;

class action_plugin_ckeditor5 extends ActionPlugin {

    public function register(EventHandler $controller) {
        $controller->register_hook('TPL_ACT_RENDER', 'AFTER', $this, 'injectEditor');
    }

    public function injectEditor(Event $event, $param) {
        if($event->data !== 'edit') return;

        ptln('<script src="'.DOKU_BASE.'lib/plugins/ckeditor5/script.js"></script>');
        ptln('<link rel="stylesheet" href="'.DOKU_BASE.'lib/plugins/ckeditor5/style.css" />');
    }
}
