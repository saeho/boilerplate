# Boilerplate

## About
This is a boilerplate app I created for few take home projects that I'm tasked with. I made it for myself for the take home projects, but also to show how I code, and how I think about creating apps and servers.

The boilerplate contains minimal client and server code with my usual code and project organization pattern; and it has a very basic JWT token authentication layer that creates a new session automatically when you open the app (which is then used to verify each API request, whether or not you are logged in).

## How to run server
- Install Deno (https://docs.deno.com/runtime/manual/getting_started/installation/)
- (Deno is identical to NodeJS, there is no learning curve or code difference.)
- Change directory to ./server -> "cd ./server"
- Add the Google service account json file to /server
- Start server -> "deno task dev"

## How to run client
- (Assuming you have NodeJS set up already.)
- Change directory to ./client -> "cd ./client"
- Start server -> "npm run dev"

# Code

## Front-end project organization
- All non-data components (aka "dumb components") are in [/components/] folder. These components do not handle any data and they do not contain hooks.
- All data components (that require/use data or hooks) are in [/containers/] folder.
- All platform-agnostic data containers are in [/platform-agnostic/data-api/] and [/platform-agnostic/data-context/] folders. These files should be copy-paste usable in React and React Native at any time.
- "Platform dependant" logic that's required for both mobile & web are located in [/lib/platform.ts].

## Systems design
I almost always start every project very simple with RDBMS (Postgres), 1 instance, MemCached for localized cache, and Redis if the data needs to be persisted across other instances. As I understand the project better and usage/business-logic becomes more clearer, I introduce NoSQL if needed (ie., if the application is write-heavy like logging, chatting, analytics, etc) and whatever 3rd party integrations and microservices as needed.

First level of scale is usually setting up a regional load balancer with 3 instances, but I think about API/high-compute-data caching pretty early and build my server with that in mind from the beginning. I like to set up MemCached in each main API/Socket instance so the local cache can be shared between the API server and Socket server, since Socket server is easiest to maintain using LB sticky sessions anyways, sharing the cache between API server and Socket server has a lot of benefits.

For cache/high compute data that needs to be shared across instances, I use Redis.

Then as the app grows, I use RabbitMQ to control traffic and request rates. If scale continues to be a problem, this is when I would introduce NoSQL for high write (or read) operations. Business logic is probably clear by this point to figure out where NoSQL is needed.

Admittedly, this is where my experience with scaling ends but this set up should scale fairly well for most applications. The most of amount of traffic I saw and had to work with was 100,000 WAU and 10+ millions of messages per week. But I'm excited at the prospect of working on bigger systems and taking on tougher challenges.

## Examples of work
My best front-end examples and demonstration of my ability to build complex full-stack features are in Big Planet. There's a lot there including WebRTC, WebSocket, and complex features with complex business logics.

I did not use any public packages (other than the major ones like React, i18n, etc) in making Big Planet.

## Complex front-end challenges I overcame
Because Kajiwoto was never meant to be a chat app, I faced a lot of unexpected performance problems. Two major ones that come up in my head are:

**1. Chat window virtualization**
In Kajiwoto, I used the most popular react DOM virtualization NPM package to display chat messages; but there were few issues.

First, Chat UI works bottom up, so a one-size-fit-all DOM virtualization package didn't work so well (because they were built to display the DOM top-to-bottom).

Second, Javascript has modernized quite a bit in the past 7 years but the most popular NPM package was still calculating the DOM elements' height to virtualize the list. Today, DOM has the ResizeObserver() API and the IntersectionObserver() API which is way better than manually calculating every DOM element height. Plus, every chat messages have unpredictable varying heights.

So in Big Planet, I overcame this challenge by creating my own DOM virtualization mini library that met all my requirements and kept the browser memory usage at minimum.

**2. Client side cache layer**
In Kajiwoto, I used a popular NPM package for GraphQL data handling and client side caching-- called "apollo-graphql".

I loved this package's use of hooks and ability to abstract the data layer of my app for reusability and better maintainability; but again, it had few issues.

To this day, apollo-graphql doesn't allow easy control over the client side cache. Every query you do is saved in memory and it just keeps stacking forever without a way to automatically evict the cache. For a chat app where there can easily be tens of thousands of messages that you can load in few minutes, the cache (and sometimes the browser memory usage) often got out of hand.

For this reason and my desire to create the most ideal client side cache solution for a chat app, I made my own client-side cache layer that is almost identical in usage to apollo-graphql (because I actually like most of their syntax/concepts and use of hooks).
