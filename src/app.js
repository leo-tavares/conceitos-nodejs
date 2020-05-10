const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const chkIfRepositoryExists = (request, response, next) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex((repo) => repo.id === id);
  if (repoIdx < 0) {
    return response.status(400).json({ message: "repository does not exists" });
  }
  request.repoIdx = repoIdx;
  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;

  const repository = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", chkIfRepositoryExists, (request, response) => {
  const {
    body: { title, url, techs },
    repoIdx,
  } = request;

  const repository = {
    ...repositories[repoIdx],
    title,
    url,
    techs,
  };

  repositories[repoIdx] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", chkIfRepositoryExists, (request, response) => {
  const {
    params: { id },
    repoIdx,
  } = request;

  repositories.splice(repoIdx, 1);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  chkIfRepositoryExists,
  (request, response) => {
    const {
      params: { id },
      repoIdx,
    } = request;

    const auxRepo = repositories[repoIdx];
    auxRepo.likes = auxRepo.likes + 1;

    return response.json(auxRepo);
  }
);

module.exports = app;
