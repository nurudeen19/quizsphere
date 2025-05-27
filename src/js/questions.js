const questions = [
    // Converted from the first array (single-answer, now using index in answers)
    {
        q: "What is Kubernetes?",
        options: [
            "A container orchestration platform",
            "A programming language",
            "A web server",
            "A database"
        ],
        answers: [0]
    },
    {
        q: "Which component of Kubernetes is responsible for managing the state of the cluster?",
        options: [
            "Kubelet",
            "Kube-Proxy",
            "Controller Manager",
            "Scheduler"
        ],
        answers: [2]
    },
    {
        q: "What is a Pod in Kubernetes?",
        options: [
            "The smallest deployable unit",
            "A type of service",
            "A storage volume",
            "A network policy"
        ],
        answers: [0]
    },
    {
        q: "Which command is used to create a deployment in Kubernetes?",
        options: [
            "kubectl create deployment",
            "kubectl run",
            "kubectl apply",
            "kubectl start"
        ],
        answers: [0]
    },
    {
        q: "What is the purpose of a Service in Kubernetes?",
        options: [
            "To expose an application running on a set of Pods",
            "To store data",
            "To manage user permissions",
            "To monitor cluster health"
        ],
        answers: [0]
    },
    {
        q: "Which of the following are core components of the Kubernetes control plane?",
        options: ["kube-apiserver", "kube-scheduler", "kubelet", "etcd"],
        answers: [0, 1, 3]
    },
    {
        q: "Which objects in Kubernetes are used to manage replicated applications?",
        options: ["Deployment", "ReplicaSet", "ConfigMap", "StatefulSet"],
        answers: [0, 1, 3]
    },
    {
        q: "What is the primary purpose of a Kubernetes Service?",
        options: ["Expose an application", "Store configuration", "Manage secrets", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes namespaces?",
        options: ["default", "kube-system", "kube-public", "prod"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the role of the kube-scheduler in Kubernetes?",
        options: ["Schedule pods to nodes", "Manage network policies", "Store cluster state", "Expose services"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes volume types?",
        options: ["emptyDir", "hostPath", "nfs", "persistentVolume"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a ConfigMap in Kubernetes?",
        options: ["Store non-sensitive configuration data", "Manage secrets", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource types?",
        options: ["Pod", "Service", "Deployment", "ConfigMap"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a PersistentVolume in Kubernetes?",
        options: ["Provide persistent storage", "Manage network policies", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes controllers?",
        options: ["Deployment controller", "ReplicaSet controller", "StatefulSet controller", "Job controller"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a DaemonSet in Kubernetes?",
        options: ["Run a pod on every node", "Manage network policies", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes labels?",
        options: ["app=nginx", "tier=frontend", "env=prod", "version=v1"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a StatefulSet in Kubernetes?",
        options: ["Manage stateful applications", "Run stateless applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes annotations?",
        options: ["description=nginx app", "maintainer=team", "version=v1.0", "created_at=2023-10-01"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a Job in Kubernetes?",
        options: ["Run a one-time task", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes API operations?",
        options: ["get", "create", "update", "delete"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a CronJob in Kubernetes?",
        options: ["Run scheduled tasks", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource limits?",
        options: ["cpu", "memory", "storage", "network"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a NetworkPolicy in Kubernetes?",
        options: ["Control network traffic between pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource requests?",
        options: ["cpu", "memory", "storage", "network"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a ServiceAccount in Kubernetes?",
        options: ["Provide an identity for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource quotas?",
        options: ["cpu", "memory", "pods", "services"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a LimitRange in Kubernetes?",
        options: ["Set default resource limits for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource selectors?",
        options: ["app=nginx", "tier=frontend", "env=prod", "version=v1"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a Role in Kubernetes?",
        options: ["Define permissions within a namespace", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource kinds?",
        options: ["Pod", "Service", "Deployment", "VolumeMount"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a ClusterRole in Kubernetes?",
        options: ["Define permissions across the cluster", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource fields?",
        options: ["metadata.name", "spec.replicas", "status.conditions", "status.podIP"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a RoleBinding in Kubernetes?",
        options: ["Bind a Role to a user or group", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource statuses?",
        options: ["Pending", "Running", "Succeeded", "Failed"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a ClusterRoleBinding in Kubernetes?",
        options: ["Bind a ClusterRole to a user or group", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource configurations?",
        options: ["spec.template.spec.containers", "spec.selector.matchLabels", "metadata.annotations", "status.podIP"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a Horizontal Pod Autoscaler in Kubernetes?",
        options: ["Automatically scale pods based on metrics", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Vertical Pod Autoscaler in Kubernetes?",
        options: ["Automatically adjust pod resource requests and limits", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a PodDisruptionBudget in Kubernetes?",
        options: ["Limit voluntary disruptions to pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Custom Resource Definition (CRD) in Kubernetes?",
        options: ["Define custom resource types", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Custom Resource in Kubernetes?",
        options: ["Extend Kubernetes with user-defined resources", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Service Mesh in Kubernetes?",
        options: ["Manage microservices communication", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Sidecar container in Kubernetes?",
        options: ["Provide auxiliary functionality to a main container", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Init container in Kubernetes?",
        options: ["Run initialization tasks before main containers", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a PodSecurityPolicy in Kubernetes?",
        options: ["Define security policies for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a PodSecurityAdmission in Kubernetes?",
        options: ["Enforce pod security standards", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "What is the purpose of a ResourceQuota in Kubernetes?",
        options: ["Limit resource usage in a namespace", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which Kubernetes object is used to define a set of network rules for pods?",
        options: ["NetworkPolicy", "Service", "ConfigMap", "Secret"],
        answers: [0]
    },
    {
        q: "What is the default namespace in Kubernetes?",
        options: ["default", "kube-system", "prod", "dev"],
        answers: [0]
    },
    {
        q: "Which command is used to scale a deployment?",
        options: ["kubectl scale", "kubectl resize", "kubectl grow", "kubectl expand"],
        answers: [0]
    },
    {
        q: "Which Kubernetes resource is used to store sensitive information?",
        options: ["Secret", "ConfigMap", "Pod", "Service"],
        answers: [0]
    },
    {
        q: "Which of the following is NOT a valid Kubernetes resource type?",
        options: ["Pod", "Service", "Deployment", "Database"],
        answers: [3]
    },
    {
        q: "Which field in a PodSpec defines the container image?",
        options: ["image", "containerImage", "spec.image", "container"],
        answers: [0]
    },
    {
        q: "Which Kubernetes object is used for batch processing?",
        options: ["Job", "Deployment", "Service", "ConfigMap"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid update strategy for StatefulSets?",
        options: ["RollingUpdate", "Recreate", "OnDelete", "BlueGreen"],
        answers: [0, 2]
    },
    {
        q: "Which command is used to get the logs of a pod?",
        options: ["kubectl logs", "kubectl get logs", "kubectl describe logs", "kubectl show logs"],
        answers: [0]
    },
    {
        q: "Which Kubernetes resource is used to define resource limits for a namespace?",
        options: ["ResourceQuota", "LimitRange", "Pod", "Service"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Horizontal Pod Autoscaler?",
        options: ["Automatically scale pods based on CPU usage", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to apply a configuration file in Kubernetes?",
        options: ["kubectl apply -f", "kubectl create -f", "kubectl update -f", "kubectl deploy -f"],
        answers: [0]
    },
    {
        q: "What is the purpose of a PersistentVolumeClaim?",
        options: ["Request storage resources from a PersistentVolume", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes scheduling policies?",
        options: ["Node Affinity", "Pod Affinity", "Taints and Tolerations", "Resource Requests"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a Service Mesh in Kubernetes?",
        options: ["Manage microservices communication and traffic routing", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to delete a resource in Kubernetes?",
        options: ["kubectl delete", "kubectl remove", "kubectl destroy", "kubectl purge"],
        answers: [0]
    },
    {
        q: "What is the purpose of a Custom Controller in Kubernetes?",
        options: ["Extend Kubernetes functionality with custom logic", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes admission controllers?",
        options: ["NamespaceLifecycle", "LimitRanger", "ServiceAccount", "NodeRestriction"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a PodPreset in Kubernetes?",
        options: ["Inject environment variables and volumes into pods at creation time", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the status of nodes in a Kubernetes cluster?",
        options: ["kubectl get nodes", "kubectl list nodes", "kubectl show nodes", "kubectl describe nodes"],
        answers: [0]
    },
    {
        q: "What is the purpose of a PodSecurityPolicy in Kubernetes?",
        options: ["Define security policies for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource types?",
        options: ["Pod", "Service", "Deployment", "ConfigMap"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a ServiceAccount in Kubernetes?",
        options: ["Provide an identity for pods to interact with the API server", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the details of a specific pod?",
        options: ["kubectl describe pod", "kubectl get pod", "kubectl show pod", "kubectl inspect pod"],
        answers: [0]
    },
    {
        q: "What is the purpose of a ConfigMap in Kubernetes?",
        options: ["Store non-sensitive configuration data for applications", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource versions?",
        options: ["v1", "v2beta1", "v1alpha1", "v2"],
        answers: [0, 1, 2]
    },
    {
        q: "What is the purpose of a StatefulSet in Kubernetes?",
        options: ["Manage stateful applications with stable network identities and persistent storage", "Manage stateless applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the events in a Kubernetes cluster?",
        options: ["kubectl get events", "kubectl list events", "kubectl show events", "kubectl describe events"],
        answers: [0]
    },
    {
        q: "What is the purpose of a DaemonSet in Kubernetes?",
        options: ["Run a copy of a pod on all or selected nodes in the cluster", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command lists all pods in all namespaces?",
        options: ["kubectl get pods --all-namespaces", "kubectl get all-pods", "kubectl list pods", "kubectl pods --all"],
        answers: [0]
    },
    {
        q: "Which Kubernetes object is used to expose HTTP and HTTPS routes from outside the cluster to services within the cluster?",
        options: ["Ingress", "Service", "Pod", "ConfigMap"],
        answers: [0]
    },
    {
        q: "Which of the following is a declarative way to manage Kubernetes resources?",
        options: ["kubectl apply -f", "kubectl exec", "kubectl logs", "kubectl delete"],
        answers: [0]
    },
    {
        q: "What is the default type of Kubernetes Service?",
        options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
        answers: [0]
    },
    {
        q: "Which command is used to create a namespace?",
        options: ["kubectl create namespace", "kubectl add namespace", "kubectl new namespace", "kubectl namespace create"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid label selector?",
        options: ["app=nginx", "tier:frontend", "env-prod", "version==v1"],
        answers: [0]
    },
    {
        q: "Which Kubernetes resource is used to manage configuration data separately from application code?",
        options: ["ConfigMap", "Secret", "Pod", "Service"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid reason to use a StatefulSet?",
        options: ["Stable network identity", "Stateless workloads", "Batch jobs", "Temporary storage"],
        answers: [0]
    },
    {
        q: "Which command is used to update a running deployment?",
        options: ["kubectl set image", "kubectl update deployment", "kubectl patch pod", "kubectl edit pod"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid probe type in Kubernetes?",
        options: ["Liveness", "Readiness", "Startup", "Shutdown"],
        answers: [0, 1, 2]
    },
    {
        q: "Which field in a Deployment manifest specifies the number of pod replicas?",
        options: ["spec.replicas", "spec.count", "metadata.replicas", "replicaCount"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid use case for a Job?",
        options: ["One-time batch processing", "Long-running web server", "Database storage", "Network policy"],
        answers: [0]
    },
    {
        q: "Which command is used to get the current context in kubectl?",
        options: ["kubectl config current-context", "kubectl get context", "kubectl show context", "kubectl context"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid resource type for RBAC?",
        options: ["Role", "ClusterRole", "RoleBinding", "ClusterRoleBinding"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to restrict pod scheduling to specific nodes?",
        options: ["nodeSelector", "nodeAffinity", "taints and tolerations", "podSelector"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to provide persistent storage to a pod?",
        options: ["PersistentVolumeClaim", "emptyDir", "hostPath", "ConfigMap"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to monitor a Kubernetes cluster?",
        options: ["Prometheus", "Grafana", "Kube-state-metrics", "Kibana"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to upgrade a Kubernetes cluster?",
        options: ["kubeadm upgrade", "kubectl upgrade", "kops upgrade", "minikube upgrade"],
        answers: [0, 2, 3]
    },
    {
        q: "Which of the following is a valid way to rollback a deployment?",
        options: ["kubectl rollout undo", "kubectl rollback", "kubectl undo", "kubectl revert"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to restrict network traffic between pods?",
        options: ["NetworkPolicy", "RBAC", "PodSecurityPolicy", "ServiceAccount"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to view logs from a pod?",
        options: ["kubectl logs", "kubectl exec", "kubectl describe pod", "kubectl get logs"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a pod?",
        options: ["kubectl run", "kubectl apply -f", "kubectl create -f", "kubectl deploy"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to update a ConfigMap?",
        options: ["kubectl edit", "kubectl apply", "kubectl patch", "kubectl update"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to schedule a pod on a node with a specific label?",
        options: ["nodeSelector", "nodeAffinity", "taints and tolerations", "hostNetwork"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to check the status of a deployment?",
        options: ["kubectl get deployment", "kubectl describe deployment", "kubectl rollout status", "kubectl status deployment"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to expose a deployment?",
        options: ["Service", "Ingress", "kubectl port-forward", "kubectl expose"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid type of Kubernetes Secret?",
        options: ["Opaque", "docker-registry", "tls", "basic-auth"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid field in a Service manifest?",
        options: ["metadata", "spec", "status", "kind"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to restrict access to the Kubernetes API?",
        options: ["RBAC", "ABAC", "PodSecurityPolicy", "NetworkPolicy"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to provide persistent storage to a pod?",
        options: ["PersistentVolume", "PersistentVolumeClaim", "hostPath", "emptyDir"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid type of Kubernetes controller?",
        options: ["Deployment", "ReplicaSet", "StatefulSet", "Job"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to upgrade a Kubernetes cluster?",
        options: ["kubeadm upgrade", "cloud provider tools", "kubectl upgrade", "kops upgrade"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to run a pod on a specific node?",
        options: ["nodeSelector", "nodeAffinity", "taints and tolerations", "hostNetwork"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to limit resource usage in Kubernetes?",
        options: ["ResourceQuota", "LimitRange", "PodSecurityPolicy", "NetworkPolicy"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to view logs from a pod?",
        options: ["kubectl logs", "kubectl exec", "kubectl describe pod", "kubectl get logs"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a pod?",
        options: ["kubectl run", "kubectl apply -f", "kubectl create -f", "kubectl deploy"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to update a ConfigMap?",
        options: ["kubectl edit", "kubectl apply", "kubectl patch", "kubectl update"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to restrict traffic between namespaces?",
        options: ["NetworkPolicy", "RBAC", "PodSecurityPolicy", "ServiceAccount"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to schedule a pod on a node with a specific label?",
        options: ["nodeSelector", "nodeAffinity", "taints and tolerations", "hostNetwork"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to check the status of a deployment?",
        options: ["kubectl get deployment", "kubectl describe deployment", "kubectl rollout status", "kubectl status deployment"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to rollback a deployment?",
        options: ["kubectl rollout undo", "kubectl rollback", "kubectl apply previous", "kubectl undo"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a namespace?",
        options: ["kubectl create namespace", "kubectl apply -f", "kubectl new namespace", "kubectl add namespace"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to expose a pod to the internet?",
        options: ["NodePort", "LoadBalancer", "Ingress", "ClusterIP"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to check resource usage in a cluster?",
        options: ["kubectl top pod", "kubectl top node", "kubectl get limits", "kubectl describe node"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to create a Job?",
        options: ["kubectl create job", "kubectl apply -f", "kubectl run --restart=OnFailure", "kubectl job create"],
        answers: [1, 2]
    },
    {
        q: "Which of the following is a valid way to create a CronJob?",
        options: ["kubectl create cronjob", "kubectl apply -f", "kubectl run --schedule", "kubectl cronjob create"],
        answers: [1]
    },
    {
        q: "Which of the following is a valid way to get information about a node?",
        options: ["kubectl get node", "kubectl describe node", "kubectl logs node", "kubectl top node"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to get information about a Pod?",
        options: ["kubectl get pod", "kubectl describe pod", "kubectl logs pod", "kubectl top pod"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to get information about a Service?",
        options: ["kubectl get service", "kubectl describe service", "kubectl logs service", "kubectl top service"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Deployment?",
        options: ["kubectl get deployment", "kubectl describe deployment", "kubectl logs deployment", "kubectl top deployment"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Namespace?",
        options: ["kubectl get namespace", "kubectl describe namespace", "kubectl logs namespace", "kubectl top namespace"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ConfigMap?",
        options: ["kubectl get configmap", "kubectl describe configmap", "kubectl logs configmap", "kubectl top configmap"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Secret?",
        options: ["kubectl get secret", "kubectl describe secret", "kubectl logs secret", "kubectl top secret"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a PersistentVolume?",
        options: ["kubectl get pv", "kubectl describe pv", "kubectl logs pv", "kubectl top pv"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a PersistentVolumeClaim?",
        options: ["kubectl get pvc", "kubectl describe pvc", "kubectl logs pvc", "kubectl top pvc"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a StatefulSet?",
        options: ["kubectl get statefulset", "kubectl describe statefulset", "kubectl logs statefulset", "kubectl top statefulset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a DaemonSet?",
        options: ["kubectl get daemonset", "kubectl describe daemonset", "kubectl logs daemonset", "kubectl top daemonset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ReplicaSet?",
        options: ["kubectl get replicaset", "kubectl describe replicaset", "kubectl logs replicaset", "kubectl top replicaset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Job?",
        options: ["kubectl get job", "kubectl describe job", "kubectl logs job", "kubectl top job"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a CronJob?",
        options: ["kubectl get cronjob", "kubectl describe cronjob", "kubectl logs cronjob", "kubectl top cronjob"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a NetworkPolicy?",
        options: ["kubectl get networkpolicy", "kubectl describe networkpolicy", "kubectl logs networkpolicy", "kubectl top networkpolicy"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ResourceQuota?",
        options: ["kubectl get resourcequota", "kubectl describe resourcequota", "kubectl logs resourcequota", "kubectl top resourcequota"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a LimitRange?",
        options: ["kubectl get limitrange", "kubectl describe limitrange", "kubectl logs limitrange", "kubectl top limitrange"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ServiceAccount?",
        options: ["kubectl get serviceaccount", "kubectl describe serviceaccount", "kubectl logs serviceaccount", "kubectl top serviceaccount"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Role?",
        options: ["kubectl get role", "kubectl describe role", "kubectl logs role", "kubectl top role"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a RoleBinding?",
        options: ["kubectl get rolebinding", "kubectl describe rolebinding", "kubectl logs rolebinding", "kubectl top rolebinding"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ClusterRole?",
        options: ["kubectl get clusterrole", "kubectl describe clusterrole", "kubectl logs clusterrole", "kubectl top clusterrole"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ClusterRoleBinding?",
        options: ["kubectl get clusterrolebinding", "kubectl describe clusterrolebinding", "kubectl logs clusterrolebinding", "kubectl top clusterrolebinding"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to list all resources in a namespace?",
        options: ["kubectl get all -n <namespace>", "kubectl list resources", "kubectl show all", "kubectl describe all"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to set a context in kubectl?",
        options: ["kubectl config use-context", "kubectl set context", "kubectl context use", "kubectl use context"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a deployment from a YAML file?",
        options: ["kubectl apply -f deployment.yaml", "kubectl create deployment.yaml", "kubectl deploy -f deployment.yaml", "kubectl run -f deployment.yaml"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to patch a resource?",
        options: ["kubectl patch", "kubectl edit", "kubectl update", "kubectl modify"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get the API resources supported by the cluster?",
        options: ["kubectl api-resources", "kubectl get apis", "kubectl list resources", "kubectl show apis"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the API versions supported by the cluster?",
        options: ["kubectl api-versions", "kubectl get apiversions", "kubectl list apis", "kubectl show apiversions"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the configuration of kubectl?",
        options: ["kubectl config view", "kubectl get config", "kubectl show config", "kubectl describe config"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the current namespace?",
        options: ["kubectl config view --minify | grep namespace", "kubectl get namespace", "kubectl show namespace", "kubectl describe namespace"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a deployment?",
        options: ["kubectl logs deployment/<name>", "kubectl get logs deployment", "kubectl describe logs deployment", "kubectl show logs deployment"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a statefulset?",
        options: ["kubectl logs statefulset/<name>", "kubectl get logs statefulset", "kubectl describe logs statefulset", "kubectl show logs statefulset"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a daemonset?",
        options: ["kubectl logs daemonset/<name>", "kubectl get logs daemonset", "kubectl describe logs daemonset", "kubectl show logs daemonset"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a job?",
        options: ["kubectl logs job/<name>", "kubectl get logs job", "kubectl describe logs job", "kubectl show logs job"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a cronjob?",
        options: ["kubectl logs cronjob/<name>", "kubectl get logs cronjob", "kubectl describe logs cronjob", "kubectl show logs cronjob"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a replicaset?",
        options: ["kubectl logs replicaset/<name>", "kubectl get logs replicaset", "kubectl describe logs replicaset", "kubectl show logs replicaset"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a pod?",
        options: ["kubectl logs pod/<name>", "kubectl get logs pod", "kubectl describe logs pod", "kubectl show logs pod"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a container in a pod?",
        options: ["kubectl logs <pod> -c <container>", "kubectl get logs <pod> <container>", "kubectl describe logs <pod> <container>", "kubectl show logs <pod> <container>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a namespace?",
        options: ["kubectl logs -n <namespace> --all", "kubectl get logs -n <namespace>", "kubectl describe logs -n <namespace>", "kubectl show logs -n <namespace>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all containers in a pod?",
        options: ["kubectl logs <pod> --all-containers=true", "kubectl get logs <pod> --all", "kubectl describe logs <pod> --all", "kubectl show logs <pod> --all"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a deployment?",
        options: ["kubectl logs deployment/<name> --all-containers=true", "kubectl get logs deployment/<name>", "kubectl describe logs deployment/<name>", "kubectl show logs deployment/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a statefulset?",
        options: ["kubectl logs statefulset/<name> --all-containers=true", "kubectl get logs statefulset/<name>", "kubectl describe logs statefulset/<name>", "kubectl show logs statefulset/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a daemonset?",
        options: ["kubectl logs daemonset/<name> --all-containers=true", "kubectl get logs daemonset/<name>", "kubectl describe logs daemonset/<name>", "kubectl show logs daemonset/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a job?",
        options: ["kubectl logs job/<name> --all-containers=true", "kubectl get logs job/<name>", "kubectl describe logs job/<name>", "kubectl show logs job/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a cronjob?",
        options: ["kubectl logs cronjob/<name> --all-containers=true", "kubectl get logs cronjob/<name>", "kubectl describe logs cronjob/<name>", "kubectl show logs cronjob/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a replicaset?",
        options: ["kubectl logs replicaset/<name> --all-containers=true", "kubectl get logs replicaset/<name>", "kubectl describe logs replicaset/<name>", "kubectl show logs replicaset/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a namespace?",
        options: ["kubectl logs -n <namespace> --all-containers=true", "kubectl get logs -n <namespace>", "kubectl describe logs -n <namespace>", "kubectl show logs -n <namespace>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all containers in a pod?",
        options: ["kubectl logs <pod> --all-containers=true", "kubectl get logs <pod> --all", "kubectl describe logs <pod> --all", "kubectl show logs <pod> --all"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a deployment?",
        options: ["kubectl logs deployment/<name> --all-containers=true", "kubectl get logs deployment/<name>", "kubectl describe logs deployment/<name>", "kubectl show logs deployment/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a statefulset?",
        options: ["kubectl logs statefulset/<name> --all-containers=true", "kubectl get logs statefulset/<name>", "kubectl describe logs statefulset/<name>", "kubectl show logs statefulset/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a daemonset?",
        options: ["kubectl logs daemonset/<name> --all-containers=true", "kubectl get logs daemonset/<name>", "kubectl describe logs daemonset/<name>", "kubectl show logs daemonset/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a job?",
        options: ["kubectl logs job/<name> --all-containers=true", "kubectl get logs job/<name>", "kubectl describe logs job/<name>", "kubectl show logs job/<name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of all pods in a cronjob?",
        options: ["kubectl logs cronjob/<name> --all-containers=true", "kubectl get logs cronjob/<name>", "kubectl describe logs cronjob/<name>", "kubectl show logs cronjob/<name>"],
        answers: [0]
    },
];

export default questions;