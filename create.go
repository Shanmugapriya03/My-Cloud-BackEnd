package main
import (
    "fmt"
    "os"
    "os/exec"
    "syscall"
)
func main() {
    switch os.Args[1] {
    case "create":
        create()
    default:
        panic("Valid command not entered")
    }
}
func create() {
    //fmt.Printf("running %v as PID %d\n", os.Args[2:], os.Getpid())
    cmd := exec.Command("/proc/self/exe", append([]string{"child"}, os.Args[2:]...)...)
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    cmd.SysProcAttr = &syscall.SysProcAttr{
        Cloneflags: syscall.CLONE_NEWUTS | syscall.CLONE_NEWPID | syscall.CLONE_NEWNS,
    }
    checkerr(cmd.Run())
    child()
}
func child() {
    fmt.Printf("running %v as PID %d\n", os.Args[2:], os.Getpid())
    cmd := exec.Command(os.Args[2], os.Args[3:]...)
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    checkerr(syscall.Chroot("/rootfs"))
    checkerr(os.Chdir("/"))
    checkerr(syscall.Mount("proc", "proc", "proc", 0, ""))
    checkerr(syscall.Mount("/dev/urandom", "/dev/urandom", "/dev/urandom", 0, ""))
    checkerr(cmd.Run())
}
func checkerr(e error) {
    if e != nil {
        panic(e)
    }
}
