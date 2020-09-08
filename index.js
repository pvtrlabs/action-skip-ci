const core = require('@actions/core');
const github = require('@actions/github');

const { createActionAuth } = require("@octokit/auth-action");

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
})

main();

async function main() {
    try {
        // const auth = createActionAuth();
        // const authentication = await auth();

        // Phrase we are looking for in Pull Requests commits
        const skipCiPhrase = core.getInput('skip-phrase');

        // GitHub's Payload
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        const payloadParsed = JSON.parse(payload)

        // Find repository name, repository owner, pull request number
        const repository = payloadParsed['repository']['full_name']
        const pull_number = payloadParsed['number']

        octokit.pulls.listCommits({
            owner: repository.split("/")[0],
            repo: repository.split("/")[1],
            pull_number: pull_number
        })
            .then(({ data }) => {
                // handle data   
                console.log(data[data.length - 1]['commit']['message'])
                if (data[data.length - 1]['commit']['message'].includes(skipCiPhrase)) {
                    core.setOutput("skip-ci", true);
                } else {
                    core.setOutput("skip-ci", false);
                }
            });
    } catch (error) {
        core.setFailed(error.message);
    } // try
} // main