# High-Concurrency Event Ticketing & Wallet Engine

A backend-heavy, system-design-focused project built to explore how production-grade systems handle high concurrency, limited inventory, transactions, consistency, failures, and scalability.

This is an ongoing conceptual project. The goal is not simply to build a ticket-booking application, but to progressively design and implement the major concepts used in modern backend and distributed systems — starting from fundamental backend architecture and gradually evolving toward advanced system design.

---

## 📌 What Is This Project?

The **High-Concurrency Event Ticketing & Wallet Engine** is a backend system that simulates the infrastructure behind a high-demand event ticketing platform.

Users can:

- Register and authenticate
- Browse events
- View ticket inventory
- Reserve limited tickets
- Hold tickets temporarily
- Purchase tickets using an internal simulated wallet
- Track wallet transactions and ticket ownership

Administrators can:

- Create and manage events
- Configure ticket inventories
- Publish or cancel events
- Manage the event lifecycle

The system is designed around one major challenge:

> **How do we safely handle thousands of users competing for a limited number of tickets without overselling, double-charging, or corrupting system state?**

---

# 🎯 Why Are We Building This?

This project is primarily being built as a **system design and backend engineering learning project**.

Instead of learning system design only through diagrams and theory, the goal is to encounter real engineering problems while building the system.

For example:

- What happens when two users request the last ticket simultaneously?
- How do database transactions maintain consistency?
- How do row locks prevent race conditions?
- What happens if a payment succeeds but the ticket confirmation fails?
- How do we safely retry failed operations?
- How do we prevent duplicate requests from causing duplicate purchases?
- How does the system scale when one server is no longer enough?
- How can asynchronous workers handle background operations?
- How do caching and database indexing affect performance?
- How do we design systems that remain reliable when individual components fail?

The project will progressively evolve as these problems are introduced.

---

# 🏗️ Project Scope

The project covers the backend infrastructure required for a high-concurrency ticketing and wallet system.

### Core Domains

- User Management
- Authentication & Authorization
- Role-Based Access Control
- Event Management
- Ticket Inventory
- Ticket Reservations
- Reservation Expiration
- Ticket Purchasing
- Wallet Management
- Wallet Ledger
- Transaction Processing
- Idempotency
- Background Processing
- Notifications
- Audit Logging

### System Concerns

The project will also explore:

- Concurrency
- Data consistency
- Transactions
- Race conditions
- Failure handling
- Scalability
- Performance
- Reliability
- Observability
- Security
- Distributed systems

---

# 🧠 System Design & Backend Heavy

This is intentionally a **backend-heavy project**.

The frontend is not the primary focus.

The majority of the engineering effort is dedicated to:

- Backend architecture
- Database design
- API design
- Transaction management
- Concurrency control
- Data consistency
- Scalability
- Fault tolerance
- Distributed system concepts

The application follows a layered backend architecture:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
PostgreSQL
```

Responsibilities are separated clearly:

- **Routes** → API routing
- **Controllers** → HTTP/request-response handling
- **Services** → Business logic
- **Models** → Database queries
- **PostgreSQL** → Persistent source of truth

As the system evolves, additional infrastructure such as workers, queues, caching and event-driven components may be introduced where they solve an actual system problem.

---

# 📚 System Design Concepts We Are Learning

The project is being developed progressively so that each feature introduces a real system-design concept.

### Backend Fundamentals

- REST API design
- Layered architecture
- Authentication
- Authorization
- RBAC
- Database schema design
- Indexing
- Pagination
- Input validation

### Database & Consistency

- PostgreSQL
- Transactions
- ACID properties
- MVCC
- Isolation levels
- Row-level locking
- `SELECT ... FOR UPDATE`
- Constraints
- Foreign keys
- Unique constraints
- Query optimization
- `EXPLAIN ANALYZE`

### Concurrency

- Race conditions
- Lost updates
- Overselling prevention
- Pessimistic locking
- Optimistic concurrency
- Atomic database operations
- Concurrent requests
- Inventory consistency

### Distributed Systems

- Horizontal scaling
- Load balancing
- Stateless services
- Caching
- Message queues
- Asynchronous processing
- Event-driven architecture
- Background workers
- Eventual consistency
- Reliable event processing
- Retry mechanisms
- Failure recovery

### Reliability & Resilience

- Idempotency
- Duplicate request handling
- Timeouts
- Retries
- Partial failures
- Transaction boundaries
- Graceful failure
- Dead-letter handling
- Observability

### Performance

- Database indexing
- Query optimization
- Connection pooling
- Caching
- Load testing
- Bottleneck identification
- Throughput
- Latency

### Security

- Password hashing
- JWT authentication
- HttpOnly cookies
- Refresh-token rotation
- Token revocation
- Role-based authorization
- Secure API design

---

# 🚀 Current Progress

The project is being implemented feature-by-feature.

Current components include:

- [x] Project foundation
- [x] Express backend
- [x] PostgreSQL integration
- [x] User registration
- [x] User login
- [x] Access & refresh tokens
- [x] Refresh-token rotation
- [x] Authentication middleware
- [x] Role-Based Access Control
- [x] Event management
- [x] Event lifecycle
- [x] Ticket inventory
- [x] Ticket reservations
- [x] PostgreSQL transactions
- [x] Row-level locking with `FOR UPDATE`
- [x] Temporary ticket holds
- [x] Reservation expiry timestamps

More features will be added progressively.

---

# 🔮 Future Plans

The system will evolve gradually from a simple PostgreSQL-backed backend into a more scalable architecture.

### Phase 1 — Backend Foundation

- Authentication
- Authorization
- Events
- Inventory
- Reservations
- Database transactions

### Phase 2 — Transactional Systems

- Wallet
- Wallet ledger
- Ticket purchasing
- Atomic purchase workflows
- Idempotency
- Payment-state modeling

### Phase 3 — Concurrency & Reliability

- Reservation expiration
- Background workers
- Retry mechanisms
- Failure recovery
- Concurrent request testing
- Load testing

### Phase 4 — Scalability

- Redis/cache layer
- Multiple backend instances
- Load balancing
- Connection-pool considerations
- Read/write scaling
- Database performance optimization

### Phase 5 — Distributed Architecture

- Message queues
- Event-driven architecture
- Reliable event delivery
- Outbox pattern
- Asynchronous workers
- Eventual consistency

### Phase 6 — Production Engineering

- Structured logging
- Metrics
- Distributed tracing
- Monitoring
- Rate limiting
- Fault isolation
- Graceful shutdown
- Performance benchmarking

The exact architecture will evolve based on the problems encountered rather than introducing technologies simply for the sake of using them.

---

# 🧩 Architecture Evolution

The system is intentionally designed to evolve.

### Starting Architecture

```text
Client
  ↓
Express API
  ↓
Service Layer
  ↓
PostgreSQL
```

### Later

```text
                    ┌── Redis
                    │
Client
  ↓
Load Balancer
  ↓
Multiple API Servers
  ↓
Services
  ↓
PostgreSQL
```

### Eventually

```text
                         ┌── Redis
                         │
Client
  ↓
Load Balancer
  ↓
API Servers
  ↓
Services
  ↓
PostgreSQL
  │
  └── Outbox
        ↓
   Message Queue
     ├── Reservation Worker
     ├── Purchase Worker
     ├── Notification Worker
     └── Other Workers
```

The architecture will be expanded only when the system encounters a problem that justifies the additional complexity.

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript

### Database

- PostgreSQL

### Authentication

- JWT
- bcrypt
- HttpOnly Cookies

### Testing & Development

- Postman
- Git
- GitHub

### Future Infrastructure

Potential technologies may include:

- Redis
- Message queues
- Background workers
- Docker
- Load testing tools
- Monitoring and observability tools

These will be introduced progressively as the architecture requires them.

---

# 📖 Learning Philosophy

This project follows a simple approach:

```text
Problem
   ↓
Understand the concept
   ↓
Understand why it is needed
   ↓
Design the solution
   ↓
Implement
   ↓
Test
   ↓
Analyze failures / trade-offs
   ↓
Commit
   ↓
Move to the next concept
```

The objective is to understand **why a system is designed a certain way**, not simply memorize system-design terminology.

---

# 🚧 Project Status

**ONGOING — CONCEPTUAL SYSTEM DESIGN PROJECT**

This project is intentionally incomplete.

It is being developed continuously to cover major **basic, intermediate, and advanced system design concepts** through practical implementation.

The final architecture is not predetermined.

As new scalability, concurrency, consistency, reliability, and distributed-system problems appear, the architecture will evolve to solve them.

> **The goal is to build the system while learning how real production systems evolve.**
