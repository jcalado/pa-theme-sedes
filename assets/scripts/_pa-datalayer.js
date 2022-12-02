export function pa_datalayer() {
    window.onload = () => {
        window.dataLayer = window.dataLayer || [];

        const noticia_autor = document.querySelector('[name="noticia_autor"]')?.content;
        const noticia_sedes_regionais = document.querySelector('[name="noticia_sedes_regionais"]')?.content;
        const noticia_sedes_proprietarias = document.querySelector('[name="noticia_sedes_proprietarias"]')?.content;
        const noticia_editoriais = document.querySelector('[name="noticia_editoriais"]')?.content;
        const noticia_departamento = document.querySelector('[name="noticia_departamento"]')?.content;
        const noticia_projeto = document.querySelector('[name="noticia_projeto"]')?.content;
        const noticia_regiao = document.querySelector('[name="noticia_regiao"]')?.content;
        const noticia_formato_post = document.querySelector('[name="noticia_formato_post"]')?.content;

        let data = {
            'url': window.location.href,
            'event': 'Pageview',
        }

        noticia_autor ? data['noticia_autor'] = noticia_autor : '';
        noticia_sedes_regionais ? data['noticia_sedes_regionais'] = noticia_sedes_regionais : '';
        noticia_sedes_proprietarias ? data['noticia_sedes_proprietarias'] = noticia_sedes_proprietarias : '';
        noticia_editoriais ? data['noticia_editoriais'] = noticia_editoriais : '';
        noticia_departamento ? data['noticia_departamento'] = noticia_departamento : '';
        noticia_projeto ? data['noticia_projeto'] = noticia_projeto : '';
        noticia_regiao ? data['noticia_regiao'] = noticia_regiao : '';
        noticia_formato_post ? data['noticia_formato_post'] = noticia_formato_post : '';
        
        dataLayer.push(data);

    }
}