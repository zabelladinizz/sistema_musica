const express = require('express');
const cors = require('cors');
const conexao = require('./db.js');
const e = require('express');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API de música funcionando!" });
});


app.get("/musicas", (req, res) => {
    const sql = "SELECT * FROM musicas";

    conexao.query(sql, (erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar músicas." });
        }
        res.status(200).json(resultados);
    });
});


app.get("/albuns", (req, res) => {
    const sql = "SELECT * FROM albuns";

    conexao.query(sql, (erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar álbuns." });
        }
        res.status(200).json(resultados);
    });
});

app.get("/artistas", (req, res) => {
    const sql = "SELECT * FROM artistas";

    conexao.query(sql, (erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        res.status(200).json(resultados);
    })
})

//PESQUISA POR ID

app.get("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql = `SELECT * FROM artistas WHERE id = ${id}`;

    conexao.query(sql, [id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Artista não encontrado." });
        }
        res.status(200).json(resultados[0]);
    })
});

app.get("/musicas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql = `SELECT * FROM musicas WHERE id = ${id}`;

    conexao.query(sql, [id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar músicas." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Música não encontrada." });
        }
        res.status(200).json(resultados[0]);
    })
});

app.get("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql = `SELECT * FROM albuns WHERE id = ${id}`;

    conexao.query(sql, [id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar álbuns." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Álbum não encontrado." });
        }
        res.status(200).json(resultados[0]);
    })
});


app.get("/artistas/:id/musicas", (req, res) => {

    const id = Number(req.params.id);

    const sql = `
        SELECT musicas.*
        FROM musicas
        INNER JOIN albuns ON musicas.album_id = albuns.id
        WHERE albuns.artista_id = ?
    `;

    conexao.query(sql, [id], (erro, resultados) => {

        if (erro) {
            return res.status(500).json({
                erro: "Erro ao listar músicas do artista."
            });
        }

        res.status(200).json(resultados);
    });
});


app.get("/artistas/:id/albuns", (req, res) => {
    const id = Number(req.params.id);

    const sql = `
        SELECT albuns.*
        FROM albuns
        INNER JOIN artistas ON albuns.artista_id = artistas.id
        WHERE artistas.id = ?
    `;

    conexao.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao listar álbuns do artista."
            });
        }

        res.status(200).json(resultados);
    });
});


app.get("/musicas-completas", (req, res) => {

    const sql = `
        SELECT
            musicas.id AS musica_id,
            musicas.titulo AS musica,
            musicas.duracao,
            albuns.titulo AS album,
            albuns.ano_lancamento,
            artistas.nome AS artista
        FROM musicas
        INNER JOIN albuns ON musicas.album_id = albuns.id
        INNER JOIN artistas ON albuns.artista_id = artistas.id
    `;

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao listar músicas completas."
            });
        }

        res.status(200).json(resultados);
    });
});


//POSTS

app.post("/artistas", (req, res) => {
    const {nome, genero, pais} = req.body;

    if (!nome || !genero || !pais) {
        return res.status(400).json({
            mensagem: "Informe nome, genero e pais"
        });
    }

    const sql = "INSERT INTO artistas (nome, genero, pais) VALUES (?, ?, ?)";
    conexao.query(sql, [nome, genero, pais],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Artista não encontrado." });
        }
        res.status(201).json({Mensagem: "Artista cadastrado com sucesso!",
        id: resultados.insertId
        });
    })
})

app.post("/musicas", (req, res) => {
    const {titulo, duracao, album_id} = req.body;
    
    if (!titulo || !duracao || !album_id) {
        return res.status(400).json({
            mensagem: "Informe titulo, duracao e album_id"
        });
    }
    const sql = "INSERT INTO musicas (titulo, duracao, album_id) VALUES (?, ?, ?)";
    conexao.query(sql, [titulo, duracao, album_id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar músicas." });
        }
        
        res.status(201).json({Mensagem: "Música cadastrada com sucesso!",
        id: resultados.insertId
        });
    })
});

app.post("/albuns", (req, res) => {
    const {titulo, ano_lancamento, artista_id} = req.body; 
    if (!titulo || !ano_lancamento || !artista_id) {
        return res.status(400).json({
            mensagem: "Informe titulo, ano_lancamento e artista_id"
        });
    }
    const sql = "INSERT INTO albuns (titulo, ano_lancamento, artista_id) VALUES (?, ?, ?)";
    conexao.query(sql, [titulo, ano_lancamento, artista_id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar álbuns." });
        }
        res.status(201).json({Mensagem: "Álbum cadastrado com sucesso!",
        id: resultados.insertId
        });
    })
});

//DELETES

app.delete("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql =`DELETE FROM artistas WHERE id = ?`;
    conexao.query(sql,[id],(erro, resultado) =>{
        if(erro){
            return res.status(500).json({ erro: "Erro ao deletar artista." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Artista não encontrado."
            });
        
        };
        res.status(200).json({ msg: "Artista deletado com sucesso!" });
    });
});

app.delete("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql =`DELETE FROM albuns WHERE id = ?`;
    conexao.query(sql,[id],(erro, resultado) =>{
        if(erro){
            return res.status(500).json({ erro: "Erro ao deletar álbum." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Álbum não encontrado."
            });
        
        };
        res.status(200).json({ msg: "Álbum deletado com sucesso!" });
    });
});

app.delete("/musicas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql =`DELETE FROM musicas WHERE id = ?`;
    conexao.query(sql,[id],(erro, resultado) =>{
        if(erro){
            return res.status(500).json({ erro: "Erro ao deletar música." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Música não encontrada."
            });
        
        };
        res.status(200).json({ msg: "Música deletada com sucesso!" });
    });
});

//PUT

app.put("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const {nome, genero, pais} = req.body;
     if (!nome || !genero || !pais) {
        return res.status(400).json({
            mensagem: "Informe nome, genero e pais"
        });
    }
    const sql = "UPDATE artistas SET nome = ?, genero = ?, pais = ? WHERE id = ?";
    conexao.query(sql, [nome, genero, pais, id], (erro, resultado) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao atualizar artista." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Artista não encontrado."
            });
        };
        res.status(200).json({ msg: "Artista atualizado com sucesso!" });
    })
});

app.put("/musicas/:id", (req, res) => {
    const id = Number(req.params.id);
    const {titulo, duracao, album_id} = req.body; 
    if (!titulo || !duracao || !album_id) {
        return res.status(400).json({
            mensagem: "Informe titulo, duracao e album_id"
        });
    }
    const sql = "UPDATE musicas SET titulo = ?, duracao = ?, album_id = ? WHERE id = ?";
    conexao.query(sql, [titulo, duracao, album_id, id], (erro, resultado) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao atualizar música." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Música não encontrada."
            });
        };
        res.status(200).json({ msg: "Música atualizada com sucesso!" });
    })
});

app.put("/albuns/:id", (req, res) => {
    const id = Number(req.params.id);
    const {titulo, ano_lancamento, artista_id} = req.body;
    if (!titulo || !ano_lancamento || !artista_id) {
        return res.status(400).json({
            mensagem: "Informe titulo, ano_lancamento e artista_id"
        });
    }       
    const sql = "UPDATE albuns SET titulo = ?, ano_lancamento = ?, artista_id = ? WHERE id = ?";
    conexao.query(sql, [titulo, ano_lancamento, artista_id, id], (erro, resultado) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao atualizar álbum." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Álbum não encontrado."
            });
        };
        res.status(200).json({ msg: "Álbum atualizado com sucesso!" });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
})