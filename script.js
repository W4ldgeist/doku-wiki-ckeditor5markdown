document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea[name=\'wikitext\']');
    if (!textarea) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'ckeditor-container';
    textarea.style.display = 'none';
    textarea.parentNode.insertBefore(container, textarea);

    function protectDokuMacros(md) {
        // Wrap {{...}} in inline code unless it already is in backticks.
        // This is intentionally conservative: it won't try to parse nested macros.
        return md.replace(/(^|[^`])(\{\{[^}\n]+\}\})/g, (m, prefix, macro) => {
            return `${prefix}\`${macro}\``;
        });
    }

    function unprotectDokuMacros(md) {
        // Turn `{{...}}` back into {{...}}
        return md.replace(/`(\{\{[^}\n]+\}\})`/g, '$1');
    }

    const script = document.createElement('script');
    script.src = DOKU_BASE + 'lib/plugins/ckeditor5markdown/ckeditor.js';
    script.onload = () => {
        ClassicEditor.default.create(container).then(editor => {
            window.editor = editor;
            editor.setData(protectDokuMacros(textarea.value));

            editor.model.document.on('change:data', () => {
                textarea.value = unprotectDokuMacros(editor.getData());
            });

            const form = textarea.closest('form');
            if (form) {
                form.addEventListener('submit', () => {
                    textarea.value = unprotectDokuMacros(editor.getData());
                });
            }
        }).catch(console.error);
    };

    document.body.appendChild(script);
});
