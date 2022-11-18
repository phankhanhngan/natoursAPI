#API
* Implement restriction that users can ony review a tour that they have actually booked
* Implement nested booking routes: /tours/:id/bookings and /users/:id/bookings
* Improve tour dates: add a participants and a soldOut field to each date. A date then
becomes like an instance of the tour. Then, when a user books, they need to select one
of the dates. A new booking will increase the number of participants in the dates. A
new booking will increase the number off participants in the date, until it is booked
out (participants > maxGroupSize). So, when a user wants to book, you nêd to check if tour
on the selected date is still available.
  - Add a new field to booking model: selectedDate. This will be selected from startDates field 
  of tourModel (which is an array of object - date, participants, soldOut)
  - Add a pre-save hook to check selected date is valid then check if the tour is still available.
  Then update the participants in bookingModel and soldOut fields of startDates in tourModel
* Implement advanced authentication features: confirm user email, keep users logged in with
  refresh tokens, two-factor authentication, etc.

#WEBSITE:
* Implement a signup form, similar to the login form
* On the tour detail page, if a user has taken a tour, allow them to add a review directly on the
website. Implement a form for this
* Hide the entire booking section on the tour detail page if current user has already booked the
tour (also prevent duplicate bookings on the model)
* Implement like tour functionality, with favorite tour page
  * BACKEND:
    * Add a new field to user model: favoriteTours: [tourSchema]
    * Add a new field to tour model: favoriteBy: [userSchema]
    * Add a new route: /tours/:id/favorite/:userId (POST)
    * Add a new route (get all users that have liked tour): /tours/:id/favorite/ (GET)
    * Add a new route (get all tours that a user has liked): /users/:id/favorite/ (GET)
    * Add a new route (unlike a tour): /tours/:id/favorite/:userId (PATCH)
  * FRONTEND:
    * Add a new route: /me/favorite
    * Add a button on tour detail page to like a tour (if user is logged in)
    * Add a button on tour card on overview page to like a tour (if user is logged in)
    * Add a new section on tour detail page to show all users that have liked the tour
    * Add a favorite tour page on user account page to show all tours that a user has liked
    * 
* On the user account page, implement the "My Reviews" page where all reviews are displayed, and
a user can edit them (react)
* For admin, implement the "Manage" pages, where they can CRUD tours, users, reviews and bookings

Khi phải tương tác với 2 model, vd như thực thi chức năng yêu thích tour, thì cần phải tạo 1 route mới
hay là có thể dùng 1 route cũ để thực hiện chức năng đó? (Bỏi vì xét cho cùng no cũng chỉ là update)
