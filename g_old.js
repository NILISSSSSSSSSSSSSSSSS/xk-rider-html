const gulp = require("gulp");
const scp = require("gulp-scp2");

gulp.task("toDev", async () => {
    await gulp
        .src("dist/**/*")
        .pipe(
            scp({
                host: "39.104.149.243",
                username: "root",
                password: "xk123456#",
                dest: "/opt/nginx/dev/rider"
            })
        )
        .on("error", err => {
            console.log(err);
        });
});

gulp.task("toTest", async () => {
    await gulp
        .src("dist/**/*")
        .pipe(
            scp({
                host: "39.104.149.243",
                username: "root",
                password: "xk123456#",
                dest: "/opt/nginx/test/rider"
            })
        )
        .on("error", err => {
            console.log(err);
        });
});
/**
 * 正式环境
 */
gulp.task("toProduct", async () => {
    await gulp
        .src("dist/**/*")
        .pipe(
            scp({
                host: "47.99.236.207",
                username: "root",
                password: "scxkkj123#",
                dest: "/data/web/rider"
            })
        )
        .on("error", err => {
            console.log(err);
        });
});
