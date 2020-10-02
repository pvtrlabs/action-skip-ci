# action-skip-ci javascript action

This action sets `skip-ci` output variable to `true` in case the last commit in your pull request finds `skip-phrase` phrase in your commit message.

GitHub has option to conditionally skip ci but it seems it does not work with pull requests.

This action aims at this particular situation: skipping GH actions in pull requests.

For referrence please take a look at this thread

<https://github.community/t/github-actions-does-not-respect-skip-ci/17325>

This action expects __GITHUB_TOKEN__ env variable to be provided.

## Inputs

### `skip-phrase`

**Required** If found in commit of PR then returns true. Default `"[skip-ci]"`.

## Outputs

### `skip-ci`

The output variable will be set to `"true"` if phrase is found in commit message.

## Example usage

```yaml
uses: pvtrlabs/action-skip-ci@v1.0.1
with:
  skip-phrase: '[skip-ci]'
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Actions usage

It is a "hacky" way to skip ci but at the moment there is no other way to get away from it within pull requests.

```yaml
name: CI Setup

on:
  pull_request:
    branches:
      - master

jobs:
  terraform:
    name: 'Job1'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Check whether to skip CI
        id: skip-workflow
        uses: pvtrlabs/action-skip-ci@v1
        with:
          skip-phrase: "[skip-ci]"

      - name: Set SKIP-CI flag
        run: echo ::set-env name=SKIP-CI::${{ steps.skip-workflow.outputs.skip-ci }}

      # Based on environment variable we either proceed with the next step or skip it
      - name: Checkout
        if: env.SKIP-CI == 'false'
        uses: actions/checkout@v2

```
