document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea[name=\'wikitext\']');
    if (!textarea) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'ckeditor-container';
    textarea.style.display = 'none';
    textarea.parentNode.insertBefore(container, textarea);

    function protectDokuSyntax(text) {
        // Protect {{...}} and [[...]] by wrapping them in inline code.
        // Conservative: does not match across newlines.
        return text
            // protect {{...}}
            .replace(/(^|[^`])(\{\{[^}\n]+\}\})/g, (m, prefix, token) => `${prefix}\`${token}\``)
            // protect [[...]]
            .replace(/(^|[^`])(\[\[[^\]\n]+\]\])/g, (m, prefix, token) => `${prefix}\`${token}\``);
    }

    function unprotectDokuSyntax(text) {
        // Unwrap `{{...}}` and `[[...]]` from inline code.
        return text
        .replace(/`(\{\{[^}\n]+\}\})`/g, '$1')
        .replace(/`(\[\[[^\]\n]+\]\])`/g, '$1');
    }

    const script = document.createElement('script');
    script.src = DOKU_BASE + 'lib/plugins/ckeditor5markdown/ckeditor.js';
    script.onload = () => {
        ClassicEditor.default.create(container).then(editor => {
            window.editor = editor;
            editor.setData(protectDokuSyntax(textarea.value));

            editor.model.document.on('change:data', () => {
                textarea.value = unprotectDokuSyntax(editor.getData());
            });

            const form = textarea.closest('form');
            if (form) {
                form.addEventListener('submit', () => {
                    textarea.value = unprotectDokuSyntax(editor.getData());
                });
            }
        }).catch(console.error);
    };

    document.body.appendChild(script);
});
