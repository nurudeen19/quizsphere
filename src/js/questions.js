const questions = [
    // Converted from the first array (single-answer, now using index in answers)
    {
        q: "What is Kubernetes?",
        options: [
            "A programming language",
            "A container orchestration platform",
            "A web server",
            "A database"
        ],
        answers: [1]
    },
    {
        q: "Which component of Kubernetes is responsible for managing the state of the cluster?",
        options: [
            "Kubelet",
            "Scheduler",
            "Controller Manager",
            "Kube-Proxy"
        ],
        answers: [2]
    },
    {
        q: "What is a Pod in Kubernetes?",
        options: [
            "A type of service",
            "The smallest deployable unit",
            "A storage volume",
            "A network policy"
        ],
        answers: [1]
    },
    {
        q: "Which command is used to create a deployment in Kubernetes?",
        options: [
            "kubectl run",
            "kubectl start",
            "kubectl apply",
            "kubectl create deployment"
        ],
        answers: [3]
    },
    {
        q: "What is the purpose of a Service in Kubernetes?",
        options: [
            "To manage user permissions",
            "To expose an application running on a set of Pods",
            "To store data",
            "To monitor cluster health"
        ],
        answers: [1]
    },
    {
        q: "Which of the following are core components of the Kubernetes control plane?",
        options: ["kube-scheduler", "kube-apiserver", "etcd", "kubelet"],
        answers: [0, 1, 2]
    },
    {
        q: "Which objects in Kubernetes are used to manage replicated applications?",
        options: ["StatefulSet", "ReplicaSet", "Deployment", "ConfigMap"],
        answers: [2, 1, 0]
    },
    {
        q: "What is the primary purpose of a Kubernetes Service?",
        options: ["Manage secrets", "Expose an application", "Store configuration", "Schedule pods"],
        answers: [1]
    },
    {
        q: "Which of the following are valid Kubernetes namespaces?",
        options: ["prod", "kube-public", "default", "kube-system"],
        answers: [2, 3, 0, 1]
    },
    {
        q: "What is the role of the kube-scheduler in Kubernetes?",
        options: ["Manage network policies", "Expose services", "Schedule pods to nodes", "Store cluster state"],
        answers: [2]
    },
    {
        q: "Which of the following are valid Kubernetes volume types?",
        options: ["nfs", "emptyDir", "hostPath", "persistentVolume"],
        answers: [1, 2, 0]
    },
    {
        q: "What is the purpose of a ConfigMap in Kubernetes?",
        options: ["Manage secrets", "Store non-sensitive configuration data", "Expose services", "Schedule pods"],
        answers: [1]
    },
    {
        q: "Which of the following are valid Kubernetes resource types?",
        options: ["ConfigMap", "Service", "Deployment", "Pod"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a PersistentVolume in Kubernetes?",
        options: ["Provide persistent storage", "Manage network policies", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes controllers?",
        options: ["Job controller", "ReplicaSet controller", "Deployment controller", "StatefulSet controller"],
        answers: [2, 1, 0, 3]
    },
    {
        q: "What is the purpose of a DaemonSet in Kubernetes?",
        options: ["Run a pod on every node", "Manage network policies", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes labels?",
        options: ["tier=frontend", "app=nginx", "version=v1", "env=prod"],
        answers: [1, 0, 3, 2]
    },
    {
        q: "What is the purpose of a StatefulSet in Kubernetes?",
        options: ["Manage stateful applications", "Run stateless applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes annotations?",
        options: ["version=v1.0", "description=nginx app", "created_at=2023-10-01", "maintainer=team"],
        answers: [1, 0, 3, 2]
    },
    {
        q: "What is the purpose of a Job in Kubernetes?",
        options: ["Run a one-time task", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes API operations?",
        options: ["delete", "create", "update", "get"],
        answers: [3, 1, 2, 0]
    },
    {
        q: "What is the purpose of a CronJob in Kubernetes?",
        options: ["Run scheduled tasks", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource limits?",
        options: ["storage", "cpu", "memory", "network"],
        answers: [1, 2, 0]
    },
    {
        q: "What is the purpose of a NetworkPolicy in Kubernetes?",
        options: ["Control network traffic between pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource requests?",
        options: ["storage", "cpu", "memory", "network"],
        answers: [1, 2, 0]
    },
    {
        q: "What is the purpose of a ServiceAccount in Kubernetes?",
        options: ["Provide an identity for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource quotas?",
        options: ["pods", "cpu", "services", "memory"],
        answers: [0, 1, 3, 2]
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
        options: ["Pod", "Service", "VolumeMount", "Deployment"],
        answers: [0, 1, 3]
    },
    {
        q: "What is the purpose of a ClusterRole in Kubernetes?",
        options: ["Define permissions across the cluster", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource fields?",
        options: ["metadata.name", "status.conditions", "spec.replicas", "status.podIP"],
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
        options: ["spec.template.spec.containers", "metadata.annotations", "spec.selector.matchLabels", "status.podIP"],
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
        options: ["Service", "ConfigMap", "NetworkPolicy", "Secret"],
        answers: [2]
    },
    {
        q: "What is the default namespace in Kubernetes?",
        options: ["kube-system", "prod", "dev", "default"],
        answers: [3]
    },
    {
        q: "Which command is used to scale a deployment?",
        options: ["kubectl resize", "kubectl grow", "kubectl scale", "kubectl expand"],
        answers: [2]
    },
    {
        q: "Which Kubernetes resource is used to store sensitive information?",
        options: ["ConfigMap", "Pod", "Service", "Secret"],
        answers: [3]
    },
    {
        q: "Which of the following is NOT a valid Kubernetes resource type?",
        options: ["Service", "Deployment", "Database", "Pod"],
        answers: [2]
    },
    {
        q: "Which field in a PodSpec defines the container image?",
        options: ["containerImage", "image", "spec.image", "container"],
        answers: [1]
    },
    {
        q: "Which Kubernetes object is used for batch processing?",
        options: ["Service", "ConfigMap", "Job", "Deployment"],
        answers: [2]
    },
    {
        q: "Which of the following is a valid update strategy for StatefulSets?",
        options: ["RollingUpdate", "OnDelete", "Recreate", "BlueGreen"],
        answers: [0, 1]
    },
    {
        q: "Which command is used to get the logs of a pod?",
        options: ["kubectl describe logs", "kubectl show logs", "kubectl get logs", "kubectl logs"],
        answers: [3]
    },
    {
        q: "Which Kubernetes resource is used to define resource limits for a namespace?",
        options: ["Pod", "Service", "ResourceQuota", "LimitRange"],
        answers: [2]
    },
    {
        q: "What is the purpose of a Horizontal Pod Autoscaler?",
        options: ["Automatically scale pods based on CPU usage", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to apply a configuration file in Kubernetes?",
        options: ["kubectl create -f", "kubectl update -f", "kubectl deploy -f", "kubectl apply -f"],
        answers: [3]
    },
    {
        q: "What is the purpose of a PersistentVolumeClaim?",
        options: ["Expose services", "Schedule pods", "Request storage resources from a PersistentVolume", "Manage stateful applications"],
        answers: [2]
    },
    {
        q: "Which of the following are valid Kubernetes scheduling policies?",
        options: ["Node Affinity", "Taints and Tolerations", "Pod Affinity", "Resource Requests"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a Service Mesh in Kubernetes?",
        options: ["Manage microservices communication and traffic routing", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to delete a resource in Kubernetes?",
        options: ["kubectl remove", "kubectl destroy", "kubectl purge", "kubectl delete"],
        answers: [3]
    },
    {
        q: "What is the purpose of a Custom Controller in Kubernetes?",
        options: ["Extend Kubernetes functionality with custom logic", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes admission controllers?",
        options: ["NodeRestriction", "NamespaceLifecycle", "LimitRanger", "ServiceAccount"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a PodPreset in Kubernetes?",
        options: ["Inject environment variables and volumes into pods at creation time", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the status of nodes in a Kubernetes cluster?",
        options: ["kubectl list nodes", "kubectl show nodes", "kubectl describe nodes", "kubectl get nodes"],
        answers: [3]
    },
    {
        q: "What is the purpose of a PodSecurityPolicy in Kubernetes?",
        options: ["Define security policies for pods", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource types?",
        options: ["ConfigMap", "Service", "Deployment", "Pod"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "What is the purpose of a ServiceAccount in Kubernetes?",
        options: ["Provide an identity for pods to interact with the API server", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the details of a specific pod?",
        options: ["kubectl show pod", "kubectl describe pod", "kubectl get pod", "kubectl inspect pod"],
        answers: [1]
    },
    {
        q: "What is the purpose of a ConfigMap in Kubernetes?",
        options: ["Store non-sensitive configuration data for applications", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which of the following are valid Kubernetes resource versions?",
        options: ["v1", "v2beta1", "v2", "v1alpha1"],
        answers: [0, 1, 3]
    },
    {
        q: "What is the purpose of a StatefulSet in Kubernetes?",
        options: ["Manage stateful applications with stable network identities and persistent storage", "Manage stateless applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command is used to view the events in a Kubernetes cluster?",
        options: ["kubectl list events", "kubectl show events", "kubectl get events", "kubectl describe events"],
        answers: [2]
    },
    {
        q: "What is the purpose of a DaemonSet in Kubernetes?",
        options: ["Run a copy of a pod on all or selected nodes in the cluster", "Manage stateful applications", "Expose services", "Schedule pods"],
        answers: [0]
    },
    {
        q: "Which command lists all pods in all namespaces?",
        options: ["kubectl get pods --all-namespaces", "kubectl list pods", "kubectl pods --all", "kubectl get all-pods"],
        answers: [0]
    },
    {
        q: "Which Kubernetes object is used to expose HTTP and HTTPS routes from outside the cluster to services within the cluster?",
        options: ["Service", "Pod", "Ingress", "ConfigMap"],
        answers: [2]
    },
    {
        q: "Which of the following is a declarative way to manage Kubernetes resources?",
        options: ["kubectl exec", "kubectl logs", "kubectl delete", "kubectl apply -f"],
        answers: [3]
    },
    {
        q: "What is the default type of Kubernetes Service?",
        options: ["NodePort", "LoadBalancer", "ExternalName", "ClusterIP"],
        answers: [3]
    },
    {
        q: "Which command is used to create a namespace?",
        options: ["kubectl add namespace", "kubectl namespace create", "kubectl new namespace", "kubectl create namespace"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid label selector?",
        options: ["app=nginx", "tier:frontend", "version==v1", "env-prod"],
        answers: [0]
    },
    {
        q: "Which Kubernetes resource is used to manage configuration data separately from application code?",
        options: ["Secret", "Pod", "Service", "ConfigMap"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid reason to use a StatefulSet?",
        options: ["Stable network identity", "Stateless workloads", "Batch jobs", "Temporary storage"],
        answers: [0]
    },
    {
        q: "Which command is used to update a running deployment?",
        options: ["kubectl patch pod", "kubectl set image", "kubectl update deployment", "kubectl edit pod"],
        answers: [1]
    },
    {
        q: "Which of the following is a valid probe type in Kubernetes?",
        options: ["Liveness", "Readiness", "Shutdown", "Startup"],
        answers: [0, 1, 3]
    },
    {
        q: "Which field in a Deployment manifest specifies the number of pod replicas?",
        options: ["spec.count", "replicaCount", "metadata.replicas", "spec.replicas"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid use case for a Job?",
        options: ["One-time batch processing", "Long-running web server", "Database storage", "Network policy"],
        answers: [0]
    },
    {
        q: "Which command is used to get the current context in kubectl?",
        options: ["kubectl config current-context", "kubectl show context", "kubectl get context", "kubectl context"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid resource type for RBAC?",
        options: ["ClusterRole", "Role", "RoleBinding", "ClusterRoleBinding"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to restrict pod scheduling to specific nodes?",
        options: ["nodeSelector", "taints and tolerations", "nodeAffinity", "podSelector"],
        answers: [0, 2, 1]
    },
    {
        q: "Which of the following is a valid way to provide persistent storage to a pod?",
        options: ["hostPath", "ConfigMap", "PersistentVolumeClaim", "emptyDir"],
        answers: [2, 0, 1]
    },
    {
        q: "Which of the following is a valid way to monitor a Kubernetes cluster?",
        options: ["Prometheus", "Kibana", "Grafana", "Kube-state-metrics"],
        answers: [0, 2, 3, 1]
    },
    {
        q: "Which of the following is a valid way to upgrade a Kubernetes cluster?",
        options: ["kubectl upgrade", "kops upgrade", "minikube upgrade", "kubeadm upgrade"],
        answers: [3, 1, 2]
    },
    {
        q: "Which of the following is a valid way to rollback a deployment?",
        options: ["kubectl revert", "kubectl rollback", "kubectl undo", "kubectl rollout undo"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid way to restrict network traffic between pods?",
        options: ["PodSecurityPolicy", "RBAC", "NetworkPolicy", "ServiceAccount"],
        answers: [2]
    },
    {
        q: "Which of the following is a valid way to view logs from a pod?",
        options: ["kubectl exec", "kubectl describe pod", "kubectl get logs", "kubectl logs"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid way to create a pod?",
        options: ["kubectl run", "kubectl apply -f", "kubectl create -f", "kubectl deploy"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to update a ConfigMap?",
        options: ["kubectl edit", "kubectl patch", "kubectl apply", "kubectl update"],
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
        options: ["Ingress", "Service", "kubectl port-forward", "kubectl expose"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid type of Kubernetes Secret?",
        options: ["docker-registry", "tls", "basic-auth", "Opaque"],
        answers: [3, 0, 1]
    },
    {
        q: "Which of the following is a valid field in a Service manifest?",
        options: ["metadata", "spec", "kind", "status"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to restrict access to the Kubernetes API?",
        options: ["PodSecurityPolicy", "RBAC", "ABAC", "NetworkPolicy"],
        answers: [1, 0, 2]
    },
    {
        q: "Which of the following is a valid way to provide persistent storage to a pod?",
        options: ["PersistentVolumeClaim", "hostPath", "emptyDir", "PersistentVolume"],
        answers: [0, 1, 3, 2]
    },
    {
        q: "Which of the following is a valid type of Kubernetes controller?",
        options: ["ReplicaSet", "StatefulSet", "Job", "Deployment"],
        answers: [3, 0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to upgrade a Kubernetes cluster?",
        options: ["kubectl upgrade", "cloud provider tools", "kops upgrade", "kubeadm upgrade"],
        answers: [3, 0, 2]
    },
    {
        q: "Which of the following is a valid way to run a pod on a specific node?",
        options: ["nodeSelector", "nodeAffinity", "hostNetwork", "taints and tolerations"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to limit resource usage in Kubernetes?",
        options: ["PodSecurityPolicy", "ResourceQuota", "LimitRange", "NetworkPolicy"],
        answers: [1, 2]
    },
    {
        q: "Which of the following is a valid way to view logs from a pod?",
        options: ["kubectl exec", "kubectl describe pod", "kubectl get logs", "kubectl logs"],
        answers: [3]
    },
    {
        q: "Which of the following is a valid way to create a pod?",
        options: ["kubectl run", "kubectl apply -f", "kubectl create -f", "kubectl deploy"],
        answers: [0, 1, 2]
    },
    {
        q: "Which of the following is a valid way to update a ConfigMap?",
        options: ["kubectl edit", "kubectl patch", "kubectl apply", "kubectl update"],
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
        options: ["kubectl rollback", "kubectl apply previous", "kubectl undo", "kubectl rollout undo"],
        answers: [3]
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
        options: ["kubectl top node", "kubectl top pod", "kubectl get limits", "kubectl describe node"],
        answers: [0, 1, 3]
    },
    {
        q: "Which of the following is a valid way to create a Job?",
        options: ["kubectl create job", "kubectl run --restart=OnFailure", "kubectl apply -f", "kubectl job create"],
        answers: [2, 1]
    },
    {
        q: "Which of the following is a valid way to create a CronJob?",
        options: ["kubectl create cronjob", "kubectl run --schedule", "kubectl apply -f", "kubectl cronjob create"],
        answers: [2]
    },
    {
        q: "Which of the following is a valid way to get information about a node?",
        options: ["kubectl describe node", "kubectl logs node", "kubectl top node", "kubectl get node"],
        answers: [0, 2, 3]
    },
    {
        q: "Which of the following is a valid way to get information about a Pod?",
        options: ["kubectl describe pod", "kubectl logs pod", "kubectl top pod", "kubectl get pod"],
        answers: [0, 1, 2, 3]
    },
    {
        q: "Which of the following is a valid way to get information about a Service?",
        options: ["kubectl describe service", "kubectl logs service", "kubectl top service", "kubectl get service"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Deployment?",
        options: ["kubectl describe deployment", "kubectl logs deployment", "kubectl top deployment", "kubectl get deployment"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Namespace?",
        options: ["kubectl describe namespace", "kubectl logs namespace", "kubectl top namespace", "kubectl get namespace"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ConfigMap?",
        options: ["kubectl describe configmap", "kubectl logs configmap", "kubectl top configmap", "kubectl get configmap"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Secret?",
        options: ["kubectl describe secret", "kubectl logs secret", "kubectl top secret", "kubectl get secret"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a PersistentVolume?",
        options: ["kubectl describe pv", "kubectl logs pv", "kubectl top pv", "kubectl get pv"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a PersistentVolumeClaim?",
        options: ["kubectl describe pvc", "kubectl logs pvc", "kubectl top pvc", "kubectl get pvc"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a StatefulSet?",
        options: ["kubectl describe statefulset", "kubectl logs statefulset", "kubectl top statefulset", "kubectl get statefulset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a DaemonSet?",
        options: ["kubectl describe daemonset", "kubectl logs daemonset", "kubectl top daemonset", "kubectl get daemonset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ReplicaSet?",
        options: ["kubectl describe replicaset", "kubectl logs replicaset", "kubectl top replicaset", "kubectl get replicaset"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Job?",
        options: ["kubectl describe job", "kubectl logs job", "kubectl top job", "kubectl get job"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a CronJob?",
        options: ["kubectl describe cronjob", "kubectl logs cronjob", "kubectl top cronjob", "kubectl get cronjob"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a NetworkPolicy?",
        options: ["kubectl describe networkpolicy", "kubectl logs networkpolicy", "kubectl top networkpolicy", "kubectl get networkpolicy"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ResourceQuota?",
        options: ["kubectl describe resourcequota", "kubectl logs resourcequota", "kubectl top resourcequota", "kubectl get resourcequota"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a LimitRange?",
        options: ["kubectl describe limitrange", "kubectl logs limitrange", "kubectl top limitrange", "kubectl get limitrange"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a ServiceAccount?",
        options: ["kubectl describe serviceaccount", "kubectl logs serviceaccount", "kubectl top serviceaccount", "kubectl get serviceaccount"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get information about a Role?",
        options: ["kubectl describe role", "kubectl logs role", "kubectl top role", "kubectl get role"],
        answers: [0, 1]
      },
      {
        q: "Which of the following are valid ways to expose a Pod to the internet?",
        options: ["NodePort", "LoadBalancer", "Ingress", "ClusterIP"],
        answers: [0, 1, 2]
      },
      {
        q: "Which of the following are valid ways to check resource usage in a cluster?",
        options: ["kubectl top pod", "kubectl top node", "kubectl get limits", "kubectl describe node"],
        answers: [0, 1, 3]
      },
      {
        q: "Which of the following are valid ways to create a Job?",
        options: ["kubectl create job", "kubectl apply -f", "kubectl run --restart=OnFailure", "kubectl job create"],
        answers: [1, 2]
      },
      {
        q: "Which of the following are valid ways to create a CronJob?",
        options: ["kubectl create cronjob", "kubectl apply -f", "kubectl run --schedule", "kubectl cronjob create"],
        answers: [1]
      },
      {
        q: "Which of the following are valid ways to get information about a node?",
        options: ["kubectl get node", "kubectl describe node", "kubectl logs node", "kubectl top node"],
        answers: [0, 1, 3]
      },
      {
        q: "Which of the following are valid ways to get information about a Pod?",
        options: ["kubectl get pod", "kubectl describe pod", "kubectl logs pod", "kubectl top pod"],
        answers: [0, 1, 2, 3]
      },
      {
        q: "Which of the following are valid ways to get information about a Service?",
        options: ["kubectl get service", "kubectl describe service", "kubectl logs service", "kubectl top service"],
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
        options: ["kubectl get namespace", "kubectl show namespace", "kubectl describe namespace", "kubectl config view --minify | grep namespace"],
        answers: [3]
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
        q: "Which command is used to get the list of all namespaces in a Kubernetes cluster?",
        options: ["kubectl get namespaces", "kubectl list namespaces", "kubectl describe namespaces", "kubectl show namespaces"],
        answers: [0]
    },
    {
        q: "Which Kubernetes object is used to manage access to the API server?",
        options: ["Role", "ServiceAccount", "ConfigMap", "Pod"],
        answers: [0, 1]
    },
    {
        q: "Which field in a Deployment manifest specifies the container image?",
        options: ["spec.template.spec.containers.image", "spec.image", "container.image", "image"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to restart a pod?",
        options: ["kubectl delete pod <pod-name>", "kubectl restart pod <pod-name>", "kubectl recreate pod <pod-name>", "kubectl reset pod <pod-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid resource type for a Kubernetes Service?",
        options: ["ClusterIP", "NodePort", "LoadBalancer", "All of the above"],
        answers: [3]
    },
    {
        q: "Which command is used to get the version of the Kubernetes client and server?",
        options: ["kubectl version", "kubectl get version", "kubectl show version", "kubectl describe version"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to label a node?",
        options: ["kubectl label node <node-name> key=value", "kubectl set label node <node-name> key=value", "kubectl annotate node <node-name> key=value", "kubectl tag node <node-name> key=value"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to taint a node?",
        options: ["kubectl taint node <node-name> key=value:NoSchedule", "kubectl set taint node <node-name> key=value:NoSchedule", "kubectl label node <node-name> key=value:NoSchedule", "kubectl annotate node <node-name> key=value:NoSchedule"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to remove a taint from a node?",
        options: ["kubectl taint node <node-name> key:NoSchedule-", "kubectl remove taint node <node-name> key:NoSchedule", "kubectl delete taint node <node-name> key:NoSchedule", "kubectl clear taint node <node-name> key:NoSchedule"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to annotate a resource?",
        options: ["kubectl annotate pod <pod-name> key=value", "kubectl label pod <pod-name> key=value", "kubectl tag pod <pod-name> key=value", "kubectl set annotation pod <pod-name> key=value"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the logs of a specific container in a pod?",
        options: ["kubectl logs <pod-name> -c <container-name>", "kubectl logs <container-name> -p <pod-name>", "kubectl get logs <pod-name> <container-name>", "kubectl describe logs <pod-name> <container-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to port-forward traffic to a pod?",
        options: ["kubectl port-forward pod/<pod-name> 8080:80", "kubectl forward pod/<pod-name> 8080:80", "kubectl expose pod/<pod-name> 8080:80", "kubectl connect pod/<pod-name> 8080:80"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a ConfigMap from a file?",
        options: ["kubectl create configmap my-config --from-file=path/to/file", "kubectl apply configmap my-config --file=path/to/file", "kubectl set configmap my-config --from-file=path/to/file", "kubectl add configmap my-config --file=path/to/file"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a Secret from literal values?",
        options: ["kubectl create secret generic my-secret --from-literal=key=value", "kubectl apply secret generic my-secret --from-literal=key=value", "kubectl set secret generic my-secret --from-literal=key=value", "kubectl add secret generic my-secret --from-literal=key=value"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the resource usage of nodes?",
        options: ["kubectl top node", "kubectl get node-usage", "kubectl describe node-usage", "kubectl show node-usage"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the resource usage of pods?",
        options: ["kubectl top pod", "kubectl get pod-usage", "kubectl describe pod-usage", "kubectl show pod-usage"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to scale a deployment to 5 replicas?",
        options: ["kubectl scale deployment <name> --replicas=5", "kubectl set replicas deployment <name> 5", "kubectl update deployment <name> --replicas=5", "kubectl resize deployment <name> 5"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to pause a deployment?",
        options: ["kubectl rollout pause deployment <name>", "kubectl pause deployment <name>", "kubectl stop deployment <name>", "kubectl suspend deployment <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to resume a paused deployment?",
        options: ["kubectl rollout resume deployment <name>", "kubectl resume deployment <name>", "kubectl start deployment <name>", "kubectl continue deployment <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to view rollout history of a deployment?",
        options: ["kubectl rollout history deployment <name>", "kubectl history deployment <name>", "kubectl get rollout deployment <name>", "kubectl describe rollout deployment <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to undo a deployment rollout?",
        options: ["kubectl rollout undo deployment <name>", "kubectl undo deployment <name>", "kubectl revert deployment <name>", "kubectl rollback deployment <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to drain a node?",
        options: ["kubectl drain <node-name>", "kubectl remove <node-name>", "kubectl delete <node-name>", "kubectl stop <node-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to cordon a node?",
        options: ["kubectl cordon <node-name>", "kubectl block <node-name>", "kubectl disable <node-name>", "kubectl stop <node-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to uncordon a node?",
        options: ["kubectl uncordon <node-name>", "kubectl unblock <node-name>", "kubectl enable <node-name>", "kubectl start <node-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to delete a namespace?",
        options: ["kubectl delete namespace <name>", "kubectl remove namespace <name>", "kubectl destroy namespace <name>", "kubectl erase namespace <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to describe a resource?",
        options: ["kubectl describe <resource> <name>", "kubectl get <resource> <name>", "kubectl show <resource> <name>", "kubectl info <resource> <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the YAML manifest of a resource?",
        options: ["kubectl get <resource> <name> -o yaml", "kubectl describe <resource> <name> -o yaml", "kubectl show <resource> <name> -o yaml", "kubectl export <resource> <name> -o yaml"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to edit a resource?",
        options: ["kubectl edit <resource> <name>", "kubectl update <resource> <name>", "kubectl modify <resource> <name>", "kubectl change <resource> <name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to patch a resource?",
        options: ["kubectl patch <resource> <name> --patch '<json-patch>'", "kubectl update <resource> <name> --patch '<json-patch>'", "kubectl modify <resource> <name> --patch '<json-patch>'", "kubectl change <resource> <name> --patch '<json-patch>'"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to create a resource from a YAML file?",
        options: ["kubectl apply -f <file>.yaml", "kubectl create -f <file>.yaml", "kubectl set -f <file>.yaml", "kubectl add -f <file>.yaml"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to delete a pod?",
        options: ["kubectl delete pod <pod-name>", "kubectl remove pod <pod-name>", "kubectl destroy pod <pod-name>", "kubectl erase pod <pod-name>"],
        answers: [0]
    },
    {
        q: "Which of the following is a valid way to get the status of a pod?",
        options: ["kubectl get pod <pod-name>", "kubectl describe pod <pod-name>", "kubectl status pod <pod-name>", "kubectl show pod <pod-name>"],
        answers: [0, 1]
    },
    {
        q: "Which of the following is a valid way to get the endpoints of a service?",
        options: ["kubectl get endpoints <service-name>", "kubectl describe endpoints <service-name>", "kubectl show endpoints <service-name>", "kubectl list endpoints <service-name>"],
        answers: [0]
    }
    // ...add more if needed to reach exactly 200...
];

// Shuffle options and update answers for each question to reduce predictability
(function randomizeAnswers(questions) {
    for (const q of questions) {
        // Pair each option with its original index
        const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
        // Shuffle the pairs
        for (let i = optionPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
        }
        // Build new options array
        q.options = optionPairs.map(pair => pair.opt);
        // Map old answer indices to new indices
        const oldToNew = {};
        optionPairs.forEach((pair, newIdx) => {
            oldToNew[pair.idx] = newIdx;
        });
        if (Array.isArray(q.answers)) {
            q.answers = q.answers.map(oldIdx => oldToNew[oldIdx]);
        } else {
            q.answers = [oldToNew[q.answers]];
        }
    }
})(questions);

// Uniqueness check utility (run once at the end of the file, not part of export)
(function checkUniqueQuestions(questions) {
    const seen = new Set();
    let duplicates = 0;
    questions.forEach((q, idx) => {
        const key = q.q.trim().toLowerCase();
        if (seen.has(key)) {
            duplicates++;
        } else {
            seen.add(key);
        }
    });
    if (duplicates > 0) {
        console.warn('Duplicate questions found:', duplicates);
    } else {
        console.info('All questions are unique.');
    }
})(questions);

export default questions;