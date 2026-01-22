document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.querySelector("textarea[name='wikitext']");
    if (!textarea) return;

    const container = document.createElement("div");
    container.id = "ckeditor-container";
    textarea.style.display = "none";
    textarea.parentNode.insertBefore(container, textarea);

    const script = document.createElement("script");
    script.src = DOKU_BASE + "lib/plugins/ckeditor5markdown/ckeditor.js";
    script.onload = () => {
        ClassicEditor
        .default
        .create(container)
        .then(editor => {
            window.editor = editor;
            editor.setData(textarea.value);

            editor.model.document.on("change:data", () => {
                textarea.value = editor.getData();
            });

            const form = textarea.closest("form");
            if (form) {
                form.addEventListener("submit", () => {
                    textarea.value = editor.getData();
                });
            }
        })
        .catch(console.error);
    };

    document.body.appendChild(script);
});
