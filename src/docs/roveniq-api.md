# Base URL and endpoints

- `http://v2.api.noroff.dev/`

## Overview

- There are three user stories to this site:
  - Visitor: A user who has not registered or logged in.
  - Customer: A registered user logged in as a customer.
  - Venue Manager: A registered user logged in as a Venue Manager.

- The site uses CRUD operations.

## Authentication

| Method | Endpoint                              | Operation                                                 | Authentication required | Venue Manager only |
| ------ | ------------------------------------- | --------------------------------------------------------- | ----------------------- | ------------------ |
| GET    | `/holidaze/bookings`                  | Retrieve booking                                          | No                      | No                 |
| GET    | `/holidaze/bookings/<id>`             | Retrieve single booking                                   | No                      | No                 |
| POST   | `/holidaze/bookings`                  | Create booking                                            | Yes                     | No                 |
| PUT    | `/holidaze/bookings`                  | Update booking                                            | Yes                     | Yes                |
| DELETE | `/holidaze/bookings`                  | Delete booking                                            | Yes                     | Yes                |
| GET    | `/holidaze/venues`                    | Retrieve venues                                           | No                      | No                 |
| GET    | `/holidaze/venues/<id>`               | Retrieve single venue                                     | No                      | No                 |
| POST   | `/holidaze/venues`                    | Create new venue                                          | Yes                     | Yes                |
| PUT    | `/holidaze/venues<id>`                | Updating venue                                            | Yes                     | Yes                |
| DELETE | `/holidaze/venues<id>`                | Delete venue                                              | Yes                     | Yes                |
| GET    | `/holidaze/venues/search?q=<query>`   | Search for venues by `name` or `descriptions`             | Yes                     | Yes                |
| GET    | `/holidaze/profiles`                  | Retrieve all profiles                                     | Yes                     | No                 |
| GET    | `/holidaze/profiles/<name>`           | Retrieve single profile by id                             | No                      | No                 |
| GET    | `/holidaze/profiles/<name>/bookings`  | Retrieve all bookings by profile                          | Yes                     | Yes                |
| GET    | `/holidaze/profiles/<name>/venues`    | Retrieve all venues made by profile                       | Yes                     | Yes                |
| PUT    | `/holidaze/profiles/<name>`           | Update or set `bio`, `venueManager`, `banner`and `avatar` | Yes                     | Yes                |
| GET    | `/holidaze/profiles/search?q=<query>` | Search for venues by `name` or `bio`                      | No                      | No                 |

## Fields

## Pagination and sorting

- Pagination: limit default at 100 and page default at 1.
- Sorting: sort is available by any property, and sortOrder can be asc or the default desc.
- The response includes a meta object with currentPage, nextPage, pageCount, totalCount and isLastPage, which will be needed for "load more" or page buttons.

## Search

- Searchable fields:
  `name`
  `bio`
  `descriptions`
