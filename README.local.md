# k8s-study-platform

Kubernetes study project on AWS EC2.

## Architecture

- kubeadm cluster
- 1 control-plane node
- 1 worker node
- Calico CNI
- Node.js app
- MariaDB Pod with PVC
- Amazon ECR image registry
- HPA with metrics-server

## Namespace

- dev

## Application

Node.js app endpoints:

- /health
- /db-check
- /add-user
- /users

## Deployment

```bash
kubectl apply -f k8s/
