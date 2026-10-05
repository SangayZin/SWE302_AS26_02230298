public class Main {

    public static void main(String[] args) {

        int total = calculateTotal(10, 20);

        System.out.println("Total: " + total);

        String user1 = "Sonam";
        String user2 = "Sonam";

        if (areUsersEqual(user1, user2)) {
            System.out.println("Users are same");
        }

        int a = 10;
        int b = 2;

        if (b != 0) {
            System.out.println(a / b);
        }

        System.out.println(calculate(10, 20));
    }

    private static int calculateTotal(int x, int y) {

        if (x > 5 && y > 10 && x + y > 20) {
            return x + y;
        }
        // The image cuts off here. Based on standard Java,
        // there would likely be an 'else' block and a final return statement.
        return 0; 
    }
    
    // The 'calculate' method is called on line 23 but is not visible in the image.
    // It would likely look something like this:
    private static int calculate(int x, int y) {
        return x * y; // Just an assumption
    }
    
    // The 'areUsersEqual' method is called on line 12 but is not visible.
    private static boolean areUsersEqual(String u1, String u2) {
        return u1.equals(u2);
    }
}