//Sure, here's the contents for the file `/kubernetes-quiz/kubernetes-quiz/src/js/questions.js`:

const questions = [
    {
        question: "What is Kubernetes?",
        answers: [
            "A container orchestration platform",
            "A programming language",
            "A web server",
            "A database"
        ],
        correctAnswer: "A container orchestration platform"
    },
    {
        question: "Which component of Kubernetes is responsible for managing the state of the cluster?",
        answers: [
            "Kubelet",
            "Kube-Proxy",
            "Controller Manager",
            "Scheduler"
        ],
        correctAnswer: "Controller Manager"
    },
    {
        question: "What is a Pod in Kubernetes?",
        answers: [
            "The smallest deployable unit",
            "A type of service",
            "A storage volume",
            "A network policy"
        ],
        correctAnswer: "The smallest deployable unit"
    },
    {
        question: "Which command is used to create a deployment in Kubernetes?",
        answers: [
            "kubectl create deployment",
            "kubectl run",
            "kubectl apply",
            "kubectl start"
        ],
        correctAnswer: "kubectl create deployment"
    },
    {
        question: "What is the purpose of a Service in Kubernetes?",
        answers: [
            "To expose an application running on a set of Pods",
            "To store data",
            "To manage user permissions",
            "To monitor cluster health"
        ],
        correctAnswer: "To expose an application running on a set of Pods"
    },
    // Add more questions here up to 100
];

export default questions;