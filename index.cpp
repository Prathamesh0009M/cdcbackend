#include <bits/stdc++.h>
using namespace std;

int main()
{

    double x = 3;
    int n = 5;

    long binForm = n;
    double ans = 1;

    while (binForm > 0)
    {
        if (binForm % 2 == 1) // Check if the current bit is set
        {
            ans *= x;
        }
        x *= x;
        binForm /= 2;   
        
    }

    printf("ans = ", ans);

    return 0;
}