const { program } = require('commander');
const questions = require('./questions.test.json');
const fs = require('fs')
const { default: inquirer } = require('inquirer');
const moment = require('moment');
const chalk = require('chalk');

function getQuestion() {
    return questions.questions[
        Math.floor(
            Math.random() * questions.questions.length)
    ]
}

program.version("0.0.1")
    .description("A simple cli tool to answer interview questions")
    .action(async () => {

        const now = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')
        const message = getQuestion();
        const output = 'answers.json';

        const answer = await inquirer.prompt(
            {
                type: 'input',
                name: 'response',
                message
            }
        );
        const newAnswer = {
            answer: answer.response,
            date: now
        }

        if (fs.existsSync(output)) {
            const contents = fs.readFileSync(output)
            const previousJson = JSON.parse(contents);
            const jsonCopy = { ...previousJson };

            const existingAnswers = Object.keys(previousJson).find((question) => question === message);
            if (existingAnswers) {
                console.log(chalk.blueBright(`You've answered this question ${jsonCopy[existingAnswers].length} times`))
                jsonCopy[existingAnswers].push(newAnswer)
            } else {
                console.log(chalk.blueBright(`First time answering this question`))
                jsonCopy[message] = [newAnswer]
            }

            fs.writeFileSync(output, JSON.stringify(jsonCopy, null, '\t'))
        } else {
            const newQA = {
                [message]: [newAnswer]
            }
            console.log(chalk.blueBright(`This is the first question you've ever answered!`));
            fs.writeFileSync(output, JSON.stringify(newQA, null, '\t'))
        }
    })

program.parse(process.argv)