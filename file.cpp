#include <iostream>
#include <string>
#include <cstring>
#include <algorithm>
#include <sstream>
#include <map>
#include <cmath>
#include <chrono>
#include <limits>
#include <cstdlib>
#include <stdio.h>
#include <unistd.h>
#include <exception>
#include <climits>
#include <vector>
#include <random>
#include <array>
#include <sys/time.h>


using namespace std;

int iter= 0;
vector<int> last_round = {0,0,0};
int treeindex = 0;
double ct1 = 3.5;
double ct2 = 6;
double ct3 = 7.5;

struct roundLogs{
    //medals 16
    vector<vector<int> > p1medals;
    vector<vector<int> > p2medals;
    vector<vector<int> > p3medals;
    //arch 14 + 6 = 20 
    int p1archpos[2];
    int p2archpos[2];
    int p3archpos[2];
    string wind;
    //dive 14 + 7 = 21
    std::vector<int> goal;
    int turnsRemaining;
    int p1points;
    int p2points;
    int p3points;
    int p1combo;
    int p2combo;
    int p3combo;
    //jump 30 + 6 = 36
    string map;
    int p1positionJump;
    int p2positionJump;
    int p3positionJump;
    int p1stunJump;
    int p2stunJump;
    int p3stunJump;
    //skate 4 + 6 =  10
    vector<int> risk;
    int p1posSkat;
    int p2posSkat;
    int p3posSkat;

    int p1risk;
    int p2risk;
    int p3risk;
}; //total nodes = 103 


long long getCurrentTimeInMilliseconds() {
    auto currentTime = std::chrono::system_clock::now().time_since_epoch();
    return std::chrono::duration_cast<std::chrono::milliseconds>(currentTime).count();
}

vector<int> splitStringToIntVector(const string& str) {
    vector<int> result;
    istringstream iss(str);
    int num;
    while (iss >> num) {
        result.push_back(num);
    }
    return result;
}

int indexOfMax(const std::vector<double>& vec) {
    if (vec.empty()) {
        return -1; 
    }
    int maxIndex = 0;
    for (int i = 1; i < vec.size(); ++i) {
        if (vec[i] > vec[maxIndex]) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

int indexOfMax(const std::array<double, 4>& vec) {
    if (vec.empty()) {
        return -1; 
    }
    int maxIndex = 0;
    for (int i = 1; i < vec.size(); ++i) {
        if (vec[i] > vec[maxIndex]) {
            maxIndex = i;
        }
    }
    return maxIndex;
}



int sumOfElements(const vector<int>& vec) {
    int sum = 0;
    for (int num : vec) {
        sum += num;
    }
    return sum;
}
/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
void findLargestAndSecondLargest(const double pointsByPlayer[3], double& largest, double& secondLargest) {
    largest = std::numeric_limits<double>::lowest();
    secondLargest = std::numeric_limits<double>::lowest();

    for (int i = 0; i < 3; ++i) {
        if (pointsByPlayer[i] > largest) {
            secondLargest = largest;
            largest = pointsByPlayer[i];
        } else if (pointsByPlayer[i] > secondLargest && pointsByPlayer[i] != largest) {
            secondLargest = pointsByPlayer[i];
        }
    }
}

double sumof_othere_ele(vector<double>& scorat, int id)
{
    int val = 0;
    for (int i = 0; i < scorat.size(); i++)
    {
        if (i == id) continue;
        val += scorat[i];
    }
    return val;
}


struct Player {
    vector<vector<int> > data; // 2D array of size [4][2]

    // Default constructor
    Player() {

        data = vector<vector<int> >(4);
        for (int i = 0; i < 4; i++)
            data[i] = {0,0};
    }

    // Copy constructor
    Player(const Player& other) {
        data = other.data;
    }

    // Assignment operator
    Player& operator=(const Player& other) {
        if (this != &other) {
            data = other.data;
        }
        return *this;
    }

    // Method to calculate points
    int getPoints() const {
        int p = 1;
        for (int i = 0; i < 4; ++i) {
            p *= (3 * data[i][0] + data[i][1]);
        }
        return p;
    }
};

struct Archery {
    std::array<array<int, 2>, 3> cursors;  // Equivalent to List<int[]>
    std::string wind;
    int index;

    // Default constructor
    Archery() : wind(""), index(0) {
    }
    Archery(const Archery& other) {
        cursors = other.cursors;
        wind = other.wind;
        index = other.index;
    }
    // Assignment operator
    Archery& operator=(const Archery& other) {
        if (this != &other) {
            index = other.index;
            cursors = other.cursors;
            wind = other.wind;
        }
        return *this;
    }

    void fast_copy(const Archery &src)
    {
        index = src.index;
        for (int i = 0; i < src.cursors.size(); ++i)
        {
            cursors[i][0] = src.cursors[i][0];
            cursors[i][1] = src.cursors[i][1];
        }
        // cursors = src.cursors;
    }

    int getWind() const {
        if (!wind.empty() && index < wind.size()) {
            return wind[index] - '0';  // Convert first character to integer
        }
        return 0;  // Return 0 if string is empty
    }


    void tick(const std::vector<int>& actions) {
        int a, offset,dx, dy;
        for (size_t i = 0; i < actions.size(); ++i) {
            a = actions[i];
            offset = this->getWind();  // Assuming wind[0] in Java translates to first element in wind vector in C++
            dx = 0;
            dy = 0;
            if (a == 1) {
                dy = offset;
            } else if (a == 2) {
                dx = -offset;
            } else if (a == 3) {
                dx = offset;
            } else {
                dy = -offset;
            }

            std::array<int, 2>& cursor = cursors[i];
            cursor[0] += dx;
            cursor[1] += dy;

            int maxDist = 20;
            if (cursor[0] > maxDist) {
                cursor[0] = maxDist;
            }
            if (cursor[1] > maxDist) {
                cursor[1] = maxDist;
            }
            if (cursor[0] < -maxDist) {
                cursor[0] = -maxDist;
            }
            if (cursor[1] < -maxDist) {
                cursor[1] = -maxDist;
            }
        }

        index++;
    }
    bool isGameOver() {
        if (wind.empty()) return true;
        if (index >= wind.size()) return true;
        return false;
    }

    void getPoints(vector<int >& points) {
        points = {0,0,0};
        double pointsByPlayer[3];
        double distance;
        for (int i = 0; i < cursors.size(); ++i) {
            distance = pow(cursors[i][0], 2) + pow(cursors[i][1], 2);
            pointsByPlayer[i] = -distance;
        }
        double largest = 0;
        double secondLargest = 0;
        findLargestAndSecondLargest(pointsByPlayer, largest, secondLargest);
        for (int i = 0; i < 3; ++i) {
            if (pointsByPlayer[i] == largest) points[i] = 3;
            else if (pointsByPlayer[i] == secondLargest) points[i] = 1;
        }
    }
};

struct Diving {
    std::vector<int> goal;
    int turnsRemaining;
    std::array<int, 3> points;
    std::array<int, 3> combo;
    int index;

    // Default constructor
    Diving() : index(0), turnsRemaining(0), points({0, 0, 0}), combo({0, 0, 0}) {}

    // Copy constructor
    Diving(const Diving& other) 
        : goal(other.goal), turnsRemaining(other.turnsRemaining),
          points(other.points), combo(other.combo), index(other.index) {}

    // Assignment operator
    Diving& operator=(const Diving& other) {
        if (this != &other) {
            goal = other.goal;
            turnsRemaining = other.turnsRemaining;
            points = other.points;
            combo = other.combo;
            index = other.index;
        }
        return *this;
    }

    void fast_copy(const Diving &src)
    {
        index = src.index;
        turnsRemaining = src.turnsRemaining;
        for (int i = 0; i < src.points.size(); ++i)
            points[i] = src.points[i];
        for (int i = 0; i < src.combo.size(); ++i)
            combo[i] = src.combo[i];
        // combo = src.combo;
        // points = src.points;
    }


    void convertStringToGoal(const std::string& input) {
        goal.clear();  // Clear the vector to ensure it's empty before adding new elements
        index = 0;
        for (char ch : input) {
            int value;
            switch (ch) {
                case 'U':
                    value = 0;
                    break;
                case 'D':
                    value = 1;
                    break;
                case 'L':
                    value = 2;
                    break;
                case 'R':
                    value = 3;
                    break;
                default:
                    continue;  // Skip characters other than 'U', 'D', 'L', 'R'
            }
            goal.push_back(value);  // Add the converted value to the goal vector
        }
    }
    
    int getReq(){
        return goal[index];
    }

    void tick(vector<int> actions) {
        int req = getReq();
        for (int i = 0; i < actions.size(); ++i) {

            if (req == actions[i]) {
                combo[i]++;
                points[i] += combo[i];
            } else {
                combo[i] = 0;
            }
        }
        index++;
    }

    void getPoints(vector<int >& pointsf) {
        pointsf = {0,0,0};
        double pointsByPlayer[3];
        for (int i = 0; i < 3; ++i) {
            pointsByPlayer[i] = points[i];
        }
        double largest = 0;
        double secondLargest =0;
        findLargestAndSecondLargest(pointsByPlayer, largest, secondLargest);
        for (int i = 0; i < 3; ++i) {
            if (pointsByPlayer[i] == largest) pointsf[i] = 3;
            else if (pointsByPlayer[i] == secondLargest) pointsf[i] = 1;
        }
    }

    bool isGameOver() {
        if (goal.empty()) return true;
        if (index >= goal.size()) return true;
        return false;
    }
};

const int PLAYER_COUNT = 3;  // Assuming there are 3 players

struct HurdleRace {
    string map;
    vector<int> positions;
    vector<int> stunTimers;
    vector<int> finished;
    bool gend;

    // Default constructor
    HurdleRace() 
        : map("") {
        positions = {0,0,0};
        stunTimers = {0,0,0};
        finished = {-1,-1,-1};
        gend = false;
    }

    // Copy constructor
    HurdleRace(const HurdleRace &other) 
        : map(other.map), positions{0}, stunTimers{0}, finished{0} {
        // Copy arrays
        for (int i = 0; i < PLAYER_COUNT; ++i) {
            positions[i] = other.positions[i];
            stunTimers[i] = other.stunTimers[i];
            finished[i] = other.finished[i];
        }
        gend = other.gend;
    }

    // Copy assignment operator
    HurdleRace& operator=(const HurdleRace &other) {
        if (this != &other) {
            map = other.map;
            // Copy arrays
            for (int i = 0; i < PLAYER_COUNT; ++i) {
                positions[i] = other.positions[i];
                stunTimers[i] = other.stunTimers[i];
                finished[i] = other.finished[i];
            }
            gend = other.gend;
        }
        return *this;
    }

    void fast_copy(const HurdleRace &src)
    {
        gend = src.gend;
        for (int i = 0; i < src.positions.size(); ++i)
            positions[i] = src.positions[i];

        for (int i = 0; i < src.stunTimers.size(); ++i)
            stunTimers[i] = src.stunTimers[i];

        for (int i = 0; i < src.finished.size(); ++i)
            finished[i] = src.finished[i];
        // positions = src.positions;
        // stunTimers = src.stunTimers;
        // finished = src.finished;
    }

    int tick(vector<int> actions) {
        int maxX = map.size() - 1;
        int countFinishes = 0;
        int a, moveBy;
        bool jump;

        for (int i = 0; i < actions.size(); ++i) {

            a = actions[i];

            if (stunTimers[i] > 0) {
                stunTimers[i] -= 1;
                continue;
            }

            if (finished[i] > -1) {
                continue;
            }

            moveBy = 0;
            jump = false;
            switch (a) {
                case 1:
                    moveBy = 2;
                    break;
                case 2:
                    moveBy = 1;
                    break;
                case 3:
                    moveBy = 3;
                    break;
                case 0:
                    moveBy = 2;
                    jump = true;
                    break;
                default : break;
            }

            for (int x = 0; x < moveBy; ++x) {
                positions[i] = min(maxX, positions[i] + 1);
                if (map[positions[i]] == '#' && !jump) {
                    stunTimers[i] = 2;
                    break;
                }
                jump = false;
            }
            if (positions[i] == maxX && finished[i] == -1) {
                    finished[i] = 1;
                    countFinishes++;
                    gend = true;
                }
        }
        return countFinishes;
    }

    bool isGameOver() { return gend; }

    void getPoints(vector<int >& points) {
        points = {0,0,0};
        double pointsByPlayer[3];
        for (int i = 0; i < 3; ++i) {
            pointsByPlayer[i] = positions[i];
        }
        double largest = 0;
        double secondLargest =0;
        findLargestAndSecondLargest(pointsByPlayer, largest, secondLargest);
        for (int i = 0; i < 3; ++i) {
            if (pointsByPlayer[i] == largest) points[i] = 3;
            else if (pointsByPlayer[i] == secondLargest) points[i] = 1;
        }
    }
};

struct RollerSpeedSkating {
    vector<int> positions;  // Array of positions for 3 players
    vector<int> risk;       // Array of risks for 3 players
    std::vector<int> directions;  // List of actions

    int length;
    int timer;

    void set_dirs(string s){
        for (int i = 0; i < s.size(); i++)
        {
            if (s[i] == 'U') directions[i] = 0;
            if (s[i] == 'D') directions[i] = 1;
            if (s[i] == 'L') directions[i] = 2;
            if (s[i] == 'R') directions[i] = 3;
        }
    }

    // Default constructor
    RollerSpeedSkating() : length(10), timer(15) {
        directions = vector<int>(3);
        risk = vector<int>(3);
        positions = vector<int>(3);
        for (int i = 0; i < 3; ++i) {
            positions[i] = 0;
            risk[i] = 0;
            directions[i] = 0;
        }
    }

    // Copy constructor
    RollerSpeedSkating(const RollerSpeedSkating& other)
        : length(other.length), timer(other.timer) {
        directions = other.directions;
        risk = other.risk;
        positions = other.positions;
            
    }

    // Copy assignment operator
    RollerSpeedSkating& operator=(const RollerSpeedSkating& other) {
        if (this != &other) {
            // Copy scalar members
            length = other.length;
            timer = other.timer;
            
            directions = other.directions;
            risk = other.risk;
            positions = other.positions;
        }
        return *this;
    }

    void fast_copy(const RollerSpeedSkating& src)
    {
        length = src.length;
        timer = src.timer;
        for (int i = 0 ;i < src.positions.size(); i++)
        {
            positions[i] = src.positions[i];
        }
        for (int i = 0 ;i < src.risk.size(); i++)
        {
            risk[i] = src.risk[i];
        }
        for (int i = 0 ;i < src.directions.size(); i++)
        {
            directions[i] = src.directions[i];
        }
        // positions = src.positions;
        // risk = src.risk;
        // directions = src.directions;
    }

    void tick(const std::vector<int>& actions) {
        int action, idx, dx, riskValue;
        for (int i = 0; i < actions.size(); ++i) {
            action = actions[i];

            if (risk[i] < 0) {
                risk[i]++;
                continue;
            }

            auto it = std::find(directions.begin(), directions.end(), action);
            idx = std::distance(directions.begin(), it);
            dx = (idx == 0) ? 1 : (idx == 3) ? 3 : 2;

            positions[i] = positions[i] + dx;
            riskValue = -1 + idx;
            risk[i] = std::max(0, risk[i] + riskValue);
        }

        for (int i = 0; i < 3; ++i) {
            if (risk[i] < 0) {
                continue;
            }

            bool clash = false;
            for (int k = 0; k < 3; ++k) {
                if (k == i) {
                    continue;
                }
                if (positions[k] % length == positions[i] % length) {
                    clash = true;
                    break;
                }
            }

            if (clash) {
                risk[i] += 2;
            }

            if (risk[i] >= 5) {
                risk[i] = -2; // stun
            }
        }

        // Shuffle directions vector using std::shuffle
        //std::shuffle(directions.begin(), directions.end(), std::default_random_engine());

        timer--;
    }
    bool isGameOver() {
        return timer <= 0;
    }

    void getPoints(vector<int >& points) {
        points = {0,0,0};
        double pointsByPlayer[3];
        for (int i = 0; i < 3; ++i) {
            pointsByPlayer[i] = positions[i];
        }
        double largest = -1;
        double secondLargest = -1;
        findLargestAndSecondLargest(pointsByPlayer, largest, secondLargest);
        for (int i = 0; i < 3; ++i) {
            if (pointsByPlayer[i] == largest) points[i] = 3;
            else if (pointsByPlayer[i] == secondLargest) points[i] = 1;
        }
    }
};


struct Game {
    HurdleRace h;
    Archery a;
    RollerSpeedSkating s;
    Diving d;
    vector<Player> players;

    // Default constructor
    Game() {players = vector<Player> (3);}

    // Copy constructor
    Game(const Game& other)
        : h(other.h), a(other.a), s(other.s), d(other.d), players(other.players) {}

    // Copy assignment operator
    Game& operator=(const Game& other) {
        // cerr << "copys start - "<<endl;
        if (this != &other) {   
            h = other.h;
            a = other.a;
            s = other.s;
            d = other.d;
            players = other.players;
        }
        // cerr << "------end"<<endl;
        return *this;
    }

    ~Game(){

    }

    void fast_copy(const Game& src)
    {
        h.fast_copy(src.h);
        a.fast_copy(src.a);
        s.fast_copy(src.s);
        d.fast_copy(src.d);
    }

    void set_input_round_score(vector<int>& split, int i)
    {
        
        for(int j = 0; j < 4; j++){
            players[i].data[j][0] = split[1 + (j*3)] ;
            players[i].data[j][1] = split[1 + (j * 3) + 1];
        }
    }

    void set_input_game(string& gpu, vector<int>& regs , int i)
    {
        if (i == 0)
        {
            h.gend = false;
            if (gpu == "GAME_OVER") {h.gend = true;}
            
            h.map = gpu;
            std::cerr << h.map << endl;
            for (int i = 0; i < 3 ; i++){
                h.positions[i] = regs[i];
                h.stunTimers[i] = regs[i + 3];
                h.finished[i] = -1;
            }
           
        }
        else if (i == 1)
        {
            a.index = 0;
            a.wind = gpu;
            cerr << a.wind << endl;
            for (int i = 0; i < 3 ; i++){
                a.cursors[i][0] = regs[i*2];
                a.cursors[i][1] = regs[i*2 +1];
            }
        }
        else if (i == 2)
        {
            if (gpu == "GAME_OVER"){s.timer = 0;}
            else { s.set_dirs(gpu); }
            
            std::cerr <<gpu<< endl;
            for (int i = 0; i < 3 ; i++){
                s.positions[i]  = regs[i];
                s.risk[i] = regs[i + 3];
            }
            s.timer = regs[6];
        }
        else if (i == 3)
        {
            d.index = 0;
            if (gpu == "GAME_OVER") {d.goal.clear();}
            else {d.convertStringToGoal(gpu);}
                
            std::cerr <<gpu<< endl;
            for (int i = 0; i < 3 ; i++){
                d.points[i] = regs[i];
                d.combo[i] = regs[i + 3];
            }
        }
    }
    int play(vector<int>&set)
    {
        int count = 0;
        if (a.isGameOver() == false) {a.tick(set); count++;};
        if (d.isGameOver() == false) {d.tick(set); count++;};
        if (h.isGameOver() == false) {h.tick(set); count++;};
        if (s.isGameOver() == false) {s.tick(set); count++;};
        return count;
    }
};

string mv_name(int m){
    if (m == 0) return "UP";
    if (m == 1) return "DOWN";
    if (m == 2) return "LEFT";
    if (m == 3) return "RIGHT";
    return "UP";
}

vector<vector<int> > all_cases;
map<int, int > all_cases_mp;
void try_Posibilitys()
{
    all_cases = vector<vector<int> >(64);

    int index = 0;
    for (int p1_move = 0; p1_move < 4; ++p1_move) {
        for (int p2_move = 0; p2_move < 4; ++p2_move) {
            for (int p3_move = 0; p3_move < 4; ++p3_move) {
                all_cases[index] = vector<int>(3);
                all_cases[index][0] = p1_move;
                all_cases[index][1] = p2_move;
                all_cases[index][2] = p3_move;
                int mm = (p1_move * 100) + (p2_move * 10) + p3_move;
                all_cases_mp[mm] = index;
                index++;
            }
        }
    } 
}

struct Node {
    int ni;
    double val;
    int mv;
    std::array<int, 4> childs;
    int signatur;
    int round;
    int id;
    bool expanded;
    int parentid;

    // Default constructor
    Node() : ni(0), val(0.0), mv(0), childs({0, 0, 0, 0}), signatur(-1), round(0), id(0), expanded(false), parentid(-1) {parentid = -1;}

    // Copy constructor
    Node(const Node& other)
        : ni(other.ni), val(other.val), mv(other.mv), childs(other.childs),
          signatur(other.signatur), round(other.round), id(other.id),
          expanded(other.expanded), parentid(other.parentid) {}

    // Assignment operator
    Node& operator=(const Node& other) {
        if (this != &other) {
            ni = other.ni;
            val = other.val;
            mv = other.mv;
            childs = other.childs;
            signatur = other.signatur;
            round = other.round;
            id = other.id;
            expanded = other.expanded;
            parentid = other.parentid;
        }
        return *this;
    }
};

struct treeSet
{
    vector<Node> tp1;
    vector<Node> tp2;
    vector<Node> tp3;

    int p1;
    int p2;
    int p3;

    int index1;
    int index2;
    int index3;

    int signtur;
    double c1;
    double c2;
    double c3;

    void newRound()
    {
        p1 = 0;
        p2 = 0;
        p3 = 0;

        c1 = ct1;
        c2 = ct1;
        c3 = ct1;

        index1 = 1;
        index2 = 1;
        index3 = 1;
        signtur++;

        tp1[0] = Node(); tp1[0].signatur = signtur;
        tp2[0] = Node(); tp2[0].signatur = signtur;
        tp3[0] = Node(); tp3[0].signatur = signtur;

    }
};

int expantionc = 0;
int random_int()
{
    return (expantionc  + 9) * 31 % 64;
}

double Const = 3.5;

void expantion(vector<Node>& tree,int& treeindex, int id){

    Node& parent = tree[id];
    if (parent.expanded == true)
        return;
    
    parent.expanded = true;   
    for (int i = 0; i < 4; i++)
    {
        expantionc++;
        int childid = treeindex;
        treeindex++;
        Node& child = tree[childid];
        parent.childs[i] = childid;

        child.ni = 0;
        child.val = 0.0;
        child.mv = i;
        child.childs = {0, 0, 0, 0};
        child.signatur = parent.signatur;
        child.round = parent.round + 1;
        child.id = childid;
        child.expanded = false;
        child.parentid = id;
    }
}


void eval_game(Game&g, vector<double>& end_score)
{
    vector<double> scorat = vector<double>(3);
    vector<double> totals = {1,1,1,1};
    vector<int> apt; g.a.getPoints(apt);
    vector<int> dpt; g.d.getPoints(dpt);
    vector<int> hpt; g.h.getPoints(hpt);
    vector<int> spt; g.s.getPoints(spt);
    

    for (int i = 0; i < 3; i++)
    {
        scorat[i] = apt[i] + dpt[i] + hpt[i] + spt[i];
        totals[i] = ((g.players[i].data[0][0] * 3 +  g.players[i].data[0][1]) + hpt[i]);
        totals[i] *=  ((g.players[i].data[1][0] * 3 +  g.players[i].data[1][1]) + apt[i]);
        totals[i] *=  ((g.players[i].data[2][0] * 3 +  g.players[i].data[2][1]) + spt[i]);
        totals[i] *=  ((g.players[i].data[3][0] * 3 +  g.players[i].data[3][1]) + dpt[i]);
        scorat[i] += totals[i]/100.0;      
    }
    end_score = vector<double>(3);
    for (int i = 0; i < 3; i++)
    {
        end_score[i] = scorat[i] - (sumof_othere_ele(scorat, i) * 0.5);
        end_score[i] *= 0.1;
    }
}

void rollOut(Game &g, vector<double>& scors)
{
    if (g.play(all_cases[random_int()]) == 0)
        eval_game(g, scors);
    else
        rollOut(g, scors);
}

void back_propagat(vector<Node>& tree, int rootid, double& vals)
{
    Node& n = tree[rootid];
    n.val += vals;
    n.ni++;
    if (n.parentid != -1) back_propagat(tree, n.parentid, vals);
}

int selection(vector<Node>& tree,int rootid, int& b, double Cv)
{
    Node& parent = tree[rootid];
    double maxv = -10000.1;
    double tmp;
    int id = 0;
    b = 1;
    double Xi ,n , N, c, Vx;
    if (tree[parent.childs[0]].ni != 0)
        c = abs(tree[parent.childs[0]].val / tree[parent.childs[0]].ni);
    else
        c = abs(tree[parent.childs[0]].val / 1);
    double g = 1;
    while(c/g > 1)
    {
        g*= 10;
    }
    for(int i = 0; i < 4; i++)
    {
        Node& child = tree[parent.childs[i]];
        if (child.ni == 0)
        {
            b = 0;
            return child.id;
        }

        Xi = child.val; // sum of values fron eash child (eash one of those child will have the some o its childdren and so on)
        n = child.ni;// number of time this node hasbeen visited
        N = parent.ni;
        Vx = (Xi / n) / g;
        //diffUCB;
        tmp = Vx + Cv * sqrt( log(N) / n );
        if (tmp > maxv)
        {
            maxv = tmp;
            id = child.id;
        }
    }
    return id;
}

void traversal(treeSet& sim, vector<int>& ids, Game& cp)
{
    int tmp1 = sim.p1;
    int tmp2 = sim.p2;
    int tmp3 = sim.p3;

    int i1 , i2, i3;
    int b1 , b2, b3;
    b1 = b2 = b3 = 0;
    vector<int> v;
    while(true)
    {
        i1 = selection(sim.tp1, tmp1, b1, sim.c1);
        i2 = selection(sim.tp2, tmp2, b2, sim.c2);
        i3 = selection(sim.tp3, tmp3, b3, sim.c3);
        // cerr << "slection end " << b1 << " " << b2 << " " << b3 << endl;
        v = {sim.tp1[i1].mv ,sim.tp2[i2].mv, sim.tp3[i3].mv};
        cp.play(v);

        if (b1 ==  0|| b2 == 0 || b3 == 0)
        {
            ids[0] = i1;
            ids[1] = i2;
            ids[2] = i3;
            return;
        }
        else
        {
            tmp1 = i1; expantion(sim.tp1, sim.index1, i1);
            tmp2 = i2; expantion(sim.tp2, sim.index2, i2);
            tmp3 = i3; expantion(sim.tp3, sim.index3, i3);
        }
    }
}

void DUCT(Game& g, treeSet& sim ,int id)
{
    long long time0 = getCurrentTimeInMilliseconds();
    Node& n1  = sim.tp1[sim.p1];
    Node& n2  = sim.tp2[sim.p2];
    Node& n3  = sim.tp3[sim.p3];
    expantion(sim.tp1, sim.index1, sim.p1);
    expantion(sim.tp2, sim.index2, sim.p2);
    expantion(sim.tp3, sim.index3, sim.p3);
    
    vector<double> scor;
    int tmp = 0;
    vector<int> ids = vector<int>(3);
    int mult = 1;
    Game cp = g;
    cerr << g.s.timer <<endl;
    if (g.s.timer >= 1)
    {
        g.s.timer = 1;
    }
    
    while (getCurrentTimeInMilliseconds() - time0 <= 45)
    {
        tmp++;
        
        //cp = g;
        if (tmp > 5000)
            break;
        cp.fast_copy(g);
        traversal(sim, ids, cp);
        rollOut(cp, scor);
        back_propagat(sim.tp1, ids[0], scor[0]);
        back_propagat(sim.tp2, ids[1], scor[1]);
        back_propagat(sim.tp3, ids[2], scor[2]);
    }
    cerr << "loop end iterating count = " << tmp << " time = "<< getCurrentTimeInMilliseconds() - time0 <<endl;
    cerr << "exp count " << expantionc<<endl;
    for (int i = 0; i < 4; i++)
    {
        cerr << "mv = " << i ;
        cerr <<"    p1 ni: " << sim.tp1[i + 1].ni << " " << sim.tp1[i + 1].val / sim.tp1[i + 1].ni << endl;
    }
}

string select_mouve1(vector<Node>& tree, int rootid)
{
    Node& root = tree[rootid];
    vector <double> me = {0, 0, 0, 0};
    for (int k = 0; k < 4; k++)
    {
        Node& kid = tree[root.childs[k]];
        me[k] = kid.val / kid.ni;

    }
    cerr << "U " << me[0] << endl;
    cerr << "D " << me[1] << endl;
    cerr << "L " << me[2] << endl;
    cerr << "R " << me[3] << endl;
    return mv_name(indexOfMax(me));
}

int main()
{
    try_Posibilitys();
    long long m = getCurrentTimeInMilliseconds();
    treeSet sim;
    sim.signtur = -1;
    sim.tp1 = vector<Node>(10000);
    sim.tp2 = vector<Node>(10000);
    sim.tp3 = vector<Node>(10000);
    cerr << sizeof(Node) <<endl;
    cerr << "allocatino time : " << getCurrentTimeInMilliseconds() - m << endl;
    int player_idx;
    cin >> player_idx; cin.ignore();
    int nb_games;
    cin >> nb_games; cin.ignore();
    iter = 0;
    string gp;
    vector<int> vec(7);
    Game g = Game();
  
    


    // game  oop
    while (1) {
        for (int i = 0; i < 3; i++) {
            string score_info;
            getline(cin, score_info);
            vector<int> split = splitStringToIntVector(score_info);
            g.set_input_round_score(split, i);
        }
        for (int i = 0; i < nb_games; i++) {
            string gpu;
            int reg_0;
            int reg_1;
            int reg_2;
            int reg_3;
            int reg_4;
            int reg_5;
            int reg_6;
            cin >> gp  >> vec[0] >> vec[1] >> vec[2] >> vec[3] >> vec[4] >> vec[5] >> vec[6]; cin.ignore();
            g.set_input_game(gp, vec, i);

        }
        ct1 = 1.5;
        ct2 = 2.5;
        ct3 = 3;
        double v;
        sim.newRound();
        v =  g.players[0].data[0][0] * 3 +  g.players[0].data[0][1];
        v *= g.players[0].data[1][0] * 3 +  g.players[0].data[1][1];
        v *= g.players[0].data[2][0] * 3 +  g.players[0].data[2][1];
        v *= g.players[0].data[3][0] * 3 +  g.players[0].data[3][1];
        if (v >= 100) sim.c1 = ct2; if (v >= 300) sim.c1= ct3;
        
        v =  g.players[1].data[0][0] * 3 +  g.players[1].data[0][1];
        v *= g.players[1].data[1][0] * 3 +  g.players[1].data[1][1];
        v *= g.players[1].data[2][0] * 3 +  g.players[1].data[2][1];
        v *= g.players[1].data[3][0] * 3 +  g.players[1].data[3][1];
        if (v >= 100) sim.c2 = ct2; if (v >= 300) sim.c2= ct3;

        v =  g.players[2].data[0][0] * 3 +  g.players[2].data[0][1];
        v *= g.players[2].data[1][0] * 3 +  g.players[2].data[1][1];
        v *= g.players[2].data[2][0] * 3 +  g.players[2].data[2][1];
        v *= g.players[2].data[3][0] * 3 +  g.players[2].data[3][1];
        if (v >= 100) sim.c2 = ct2; if (v >= 300) sim.c3= ct3;
    

        expantionc = 0;
        iter++;
        long long v1= getCurrentTimeInMilliseconds();
        string res = "up";
        
        cerr << "start "<<getCurrentTimeInMilliseconds() - v1 << endl;
        cerr << sim.c1 << endl;
        DUCT(g, sim, player_idx);
        cerr << "end" << endl;

        // long long v2= getCurrentTimeInMilliseconds();
        // std::cerr << "time :" << v2 - v1 << "- ni : " <<sim.ni<<   endl;

        if (player_idx == 0) res = select_mouve1(sim.tp1, 0);
        if (player_idx == 1) res = select_mouve1(sim.tp2, 0);
        if (player_idx == 2) res = select_mouve1(sim.tp3, 0);
        // Write an action using cout. DON'T FORGET THE "<< endl"
        // To debug: std::cerr << "Debug messages..." << endl;

        std::cout << res << endl;        
    }
}