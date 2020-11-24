# foochat
* Branches: testing/datCT

# Folder api 

* Thao tác api với server

# Folder app 

* Thao tác với redux

# Folder constants

* Folder khai báo các hằng số

# Folder components 

* Chứa những cái chia sẽ, sử dụng chung những cái features khác nhau

# Folder features

* Bao gồm những tính năng, như là nhóm tính năng liên quan tới product, nhóm tính năng liên quan tơi user, comment, ... 

# Overview construct folder client

src
|__ `api`
|__ `app`
|__ `constants`
|__ `components (shared components between features)`
| |__ `Loading`
|     |__ `index.jsx`
|     |__ `styles.scss`
|
|__ `features`
| |__ `Todo`
|    |__ `components (components of feature Todo)`
|    |__ `pages (pages of feature Todo)`
|    |__ `index.jsx (entry point of feature Todo)`
|
|__ `App.js`